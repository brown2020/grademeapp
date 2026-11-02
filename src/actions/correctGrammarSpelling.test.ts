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

const { correctGrammarAndSpelling } = await import("./correctGrammarSpelling");
const { creditsForTokens } = await import("@/lib/server/creditCost");

const correct = (text = "This sentence have a error.", modelId = "openai:gpt-6-sol") =>
  correctGrammarAndSpelling(text, modelId);

let db: FakeAdminDb;
const profileOf = (uid: string) => `users/${uid}/profile/userData`;

function streamOf(text: string, usage: { inputTokens: number; outputTokens: number } | Error) {
  return {
    textStream: (async function* () {
      yield text;
    })(),
    usage: usage instanceof Error ? Promise.reject(usage) : Promise.resolve(usage),
  };
}

beforeEach(() => {
  db = createFakeAdminDb({
    [profileOf("alice")]: { credits: 1000, useCredits: false, openai_api_key: "sk-alice" },
    [profileOf("bob")]: { credits: 1000, useCredits: true, openai_api_key: "sk-bob" },
    [profileOf("broke")]: { credits: 0, useCredits: true },
    [profileOf("carol")]: { credits: 1000, useCredits: false, openai_api_key: "  " },
  });
  state.db = db;
  state.cookie = undefined;
  state.verifyIdToken = async (token) => ({ uid: token.replace("token-", "") });
  state.getModel = vi.fn(() => ({}));
  state.streamText = vi.fn(() => streamOf("This sentence has an error.", { inputTokens: 100, outputTokens: 50 }));
});

describe("correctGrammarAndSpelling", () => {
  it("rejects an unauthenticated call before any model work", async () => {
    await expect(correct()).rejects.toThrow(/Authentication required/i);
    expect(state.streamText).not.toHaveBeenCalled();
  });

  it("rejects an invalid session token", async () => {
    state.cookie = "token-forged";
    state.verifyIdToken = async () => {
      throw new Error("auth/argument-error");
    };
    await expect(correct()).rejects.toThrow(/Authentication required/i);
    expect(state.streamText).not.toHaveBeenCalled();
  });

  it("rejects empty or malformed input before auth, billing, or model work", async () => {
    state.cookie = "token-bob";
    await expect(correct("   ")).rejects.toThrow(/cannot be empty/i);
    await expect(correct("Hello.", "not a model")).rejects.toThrow();
    await expect(correct("x".repeat(200_001))).rejects.toThrow();
    expect(state.streamText).not.toHaveBeenCalled();
    expect(db.docs.get(profileOf("bob"))?.credits).toBe(1000);
  });

  it("corrects with the session user's own key and does not charge credits", async () => {
    state.cookie = "token-alice";
    const result = await correct("This sentence have a error.", "openai:gpt-6-astra");
    expect(state.getModel).toHaveBeenCalledWith("openai:gpt-6-astra", "sk-alice");
    expect(result.correctedTextArray).toEqual(["This sentence has an error."]);
    expect(result.totalCreditsUsed).toBe(0);
    expect(result.credits).toBe(1000);
    expect(db.docs.get(profileOf("alice"))?.credits).toBe(1000);
  });

  it("reserves credits, then settles to measured usage", async () => {
    state.cookie = "token-bob";
    const result = await correct();
    expect(state.getModel).toHaveBeenCalledWith("openai:gpt-6-sol");
    expect(result.correctedTextArray).toEqual(["This sentence has an error."]);
    const measured = creditsForTokens(100, 50);
    expect(result.totalCreditsUsed).toBe(measured);
    expect(result.credits).toBe(1000 - measured);
    expect(db.docs.get(profileOf("bob"))?.credits).toBe(1000 - measured);
  });

  it("refunds the reservation when the provider call fails", async () => {
    state.cookie = "token-bob";
    state.streamText = vi.fn(() => streamOf("partial", new Error("provider down")));
    await expect(correct()).rejects.toThrow(/provider down/);
    expect(db.docs.get(profileOf("bob"))?.credits).toBe(1000);
  });

  it("refuses to correct when the server balance cannot cover the reservation", async () => {
    state.cookie = "token-broke";
    await expect(correct()).rejects.toThrow(/Not enough credits/i);
    expect(state.streamText).not.toHaveBeenCalled();
    expect(db.docs.get(profileOf("broke"))?.credits).toBe(0);
  });

  it("bills platform credits when BYO mode asks for a non-BYO provider", async () => {
    state.cookie = "token-alice";
    await correct("This sentence have a error.", "anthropic:claude-opus-x");
    expect(state.getModel).toHaveBeenCalledWith("openai:gpt-6-sol");
    expect(db.docs.get(profileOf("alice"))?.credits).toBeLessThan(1000);
  });

  it("bills platform credits when the saved BYO key is blank", async () => {
    state.cookie = "token-carol";
    await correct();
    expect(state.getModel).toHaveBeenCalledWith("openai:gpt-6-sol");
    expect(db.docs.get(profileOf("carol"))?.credits).toBeLessThan(1000);
  });

  it("splits a long draft into several model calls and settles every chunk", async () => {
    state.cookie = "token-bob";
    const draft = "word ".repeat(20_000).trim();
    const result = await correct(draft);
    const calls = vi.mocked(state.streamText).mock.calls.length;
    expect(calls).toBeGreaterThan(1);
    expect(result.correctedTextArray).toEqual(Array.from({ length: calls }, () => "This sentence has an error."));
    const measured = calls * creditsForTokens(100, 50);
    expect(result.totalCreditsUsed).toBe(measured);
    expect(db.docs.get(profileOf("bob"))?.credits).toBe(1000 - measured);
  });
});
