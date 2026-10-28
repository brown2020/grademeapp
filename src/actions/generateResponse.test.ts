import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeAdminDb, type FakeAdminDb } from "@/lib/server/testing/fakeAdminDb";

const state = vi.hoisted(() => ({
  db: null as unknown,
  cookie: undefined as string | undefined,
  verifyIdToken: (() => Promise.resolve({})) as (token: string) => Promise<{ uid?: string }>,
  getModel: (() => ({})) as (model: string, apiKey?: string) => unknown,
  streamText: (() => ({})) as () => unknown,
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => (state.cookie ? { value: state.cookie } : undefined),
  }),
}));
vi.mock("firebase-admin/firestore", () => ({
  FieldValue: { increment: (n: number) => ({ __increment: n }) },
}));
vi.mock("@/firebase/firebaseAdmin", () => ({
  get adminDb() {
    return state.db;
  },
  adminAuth: { verifyIdToken: (token: string) => state.verifyIdToken(token) },
}));
vi.mock("@/lib/utils/registry", () => ({
  isProviderEnabled: () => true,
  getModel: (model: string, apiKey?: string) =>
    apiKey ? state.getModel(model, apiKey) : state.getModel(model),
}));
vi.mock("ai", () => ({ streamText: () => state.streamText() }));
vi.mock("@ai-sdk/rsc", () => ({
  createStreamableValue: () => {
    const stream = {
      value: "stream",
      append() {
        return stream;
      },
      done() {
        return stream;
      },
      error() {
        return stream;
      },
    };
    return stream;
  },
}));

const { generateGrade } = await import("./generateResponse");
const { creditsForTokens } = await import("@/lib/server/creditCost");
const { waitForSettlements } = await import("@/lib/server/gradeStream");

const grade = () =>
  generateGrade("openai:gpt-6-sol", "student", "9th grade", "teacher", "topic", "essay",
    "class", "less than", "500", "{}", "Title", "An essay about things.");

let db: FakeAdminDb;
const profileOf = (uid: string) => `users/${uid}/profile/userData`;

beforeEach(() => {
  db = createFakeAdminDb({
    [profileOf("alice")]: { credits: 1000, useCredits: false, openai_api_key: "sk-alice" },
    [profileOf("bob")]: { credits: 1000, useCredits: true, openai_api_key: "sk-bob" },
    [profileOf("broke")]: { credits: 0, useCredits: true },
    [profileOf("carol")]: { credits: 1000, useCredits: false, openai_api_key: "  ", fireworks_api_key: "" },
  });
  state.db = db;
  state.cookie = undefined;
  state.verifyIdToken = async (token) => ({ uid: token.replace("token-", "") });
  state.getModel = vi.fn(() => ({}));
  state.streamText = vi.fn(() => ({
    textStream: (async function* () {
      yield "Grade: 90%";
    })(),
    usage: Promise.resolve({ inputTokens: 1000, outputTokens: 1000 }),
  }));
});

describe("generateGrade auth and billing", () => {
  it("rejects an unauthenticated call before any model work", async () => {
    await expect(grade()).rejects.toThrow(/Authentication required/i);
    expect(state.streamText).not.toHaveBeenCalled();
  });

  it("rejects an invalid session token", async () => {
    state.cookie = "token-forged";
    state.verifyIdToken = async () => {
      throw new Error("auth/argument-error");
    };
    await expect(grade()).rejects.toThrow(/Authentication required/i);
    expect(state.streamText).not.toHaveBeenCalled();
  });

  it("uses only the session user's BYO key and does not charge credits", async () => {
    state.cookie = "token-alice";
    const result = await grade();
    await waitForSettlements();
    expect(state.getModel).toHaveBeenCalledWith("openai:gpt-6-sol", "sk-alice");
    expect(result.credits).toBe(1000);
    expect(db.docs.get(profileOf("alice"))?.credits).toBe(1000);
    expect(db.docs.get(profileOf("bob"))?.credits).toBe(1000);
  });

  it("reserves credits before the model call and settles to measured usage", async () => {
    state.cookie = "token-bob";
    const result = await grade();
    expect(state.streamText).toHaveBeenCalled();
    expect(result.credits).toBeLessThan(1000);
    expect(db.docs.get(profileOf("bob"))?.credits).toBe(result.credits);
    await waitForSettlements();
    expect(db.docs.get(profileOf("bob"))?.credits).toBe(1000 - creditsForTokens(1000, 1000));
  });

  it("refunds the reservation when the provider call fails", async () => {
    state.cookie = "token-bob";
    state.streamText = vi.fn(() => ({
      textStream: (async function* () {
        yield "Grade: 1%";
      })(),
      usage: Promise.resolve().then(() => {
        throw new Error("provider down");
      }),
    }));
    await grade();
    await waitForSettlements();
    expect(db.docs.get(profileOf("bob"))?.credits).toBe(1000);
  });

  it("refuses to grade on credits the server says the user does not have", async () => {
    state.cookie = "token-broke";
    await expect(grade()).rejects.toThrow(/Not enough credits/i);
    expect(state.streamText).not.toHaveBeenCalled();
  });
});

describe("generateGrade input contract", () => {
  const gradeWith = (modelId: string, text = "An essay about things.", title = "Title") =>
    generateGrade(modelId, "student", "9th grade", "teacher", "topic", "essay",
      "class", "less than", "500", "{}", title, text);

  it("runs platform-credit grades only on listed models", async () => {
    state.cookie = "token-bob";
    await gradeWith("openai:gpt-6-astra");
    expect(state.getModel).toHaveBeenCalledWith("openai:gpt-6-sol");
  });

  it("lets BYO-key users choose any OpenAI model on their own key", async () => {
    state.cookie = "token-alice";
    await gradeWith("openai:gpt-6-astra");
    expect(state.getModel).toHaveBeenCalledWith("openai:gpt-6-astra", "sk-alice");
    expect(db.docs.get(profileOf("alice"))?.credits).toBe(1000);
  });

  it("bills platform credits when BYO mode requests a non-BYO provider", async () => {
    state.cookie = "token-alice";
    await gradeWith("anthropic:claude-opus-x");
    expect(state.getModel).toHaveBeenCalledWith("openai:gpt-6-sol");
    expect(db.docs.get(profileOf("alice"))?.credits).toBeLessThan(1000);
  });

  it("bills platform credits when the saved BYO key is blank", async () => {
    state.cookie = "token-carol";
    await gradeWith("openai:gpt-6-sol");
    expect(state.getModel).toHaveBeenCalledWith("openai:gpt-6-sol");
    expect(db.docs.get(profileOf("carol"))?.credits).toBeLessThan(1000);
  });

  it("rejects malformed or oversized input before auth, billing or model work", async () => {
    state.cookie = "token-bob";
    await expect(gradeWith("openai:gpt 6; drop")).rejects.toThrow();
    await expect(gradeWith("openai:gpt-6-sol", "x".repeat(200_001))).rejects.toThrow();
    await expect(gradeWith("openai:gpt-6-sol", "ok", "t".repeat(301))).rejects.toThrow();
    expect(state.streamText).not.toHaveBeenCalled();
    expect(db.docs.get(profileOf("bob"))?.credits).toBe(1000);
  });
});
