import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeAdminDb, type FakeAdminDb } from "@/lib/server/testing/fakeAdminDb";

const state = vi.hoisted(() => ({
  db: null as unknown,
  cookie: undefined as string | undefined,
  intent: null as null | Record<string, unknown>,
  create: (() => Promise.resolve({ client_secret: "secret" })) as (args: unknown) => Promise<unknown>,
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => (state.cookie ? { value: state.cookie } : undefined),
  }),
}));
vi.mock("firebase-admin/firestore", () => ({
  FieldValue: { increment: (n: number) => ({ __increment: n }) },
  Timestamp: { now: () => ({ toMillis: () => 0 }) },
}));
vi.mock("@/firebase/firebaseAdmin", () => ({
  get adminDb() {
    return state.db;
  },
  adminAuth: { verifyIdToken: async (token: string) => ({ uid: token.replace("token-", "") }) },
}));
vi.mock("stripe", () => {
  class StripeMock {
    paymentIntents = {
      create: (args: unknown) => state.create(args),
      retrieve: async () => state.intent,
    };
  }
  return { default: StripeMock };
});

process.env.NEXT_PUBLIC_STRIPE_PRODUCT_NAME = "grademe_credits";
const { completePayment, createPaymentIntent } = await import("./paymentActions");

let db: FakeAdminDb;
const PROFILE = "users/alice/profile/userData";
const intentFor = (uid: string, overrides: Record<string, unknown> = {}) => ({
  id: "pi_123",
  status: "succeeded",
  amount: 9999,
  currency: "usd",
  created: 1_700_000_000,
  metadata: { uid },
  ...overrides,
});

beforeEach(() => {
  db = createFakeAdminDb({ [PROFILE]: { credits: 50 } });
  state.db = db;
  state.cookie = undefined;
  state.intent = null;
  state.create = vi.fn(async () => ({ client_secret: "secret" }));
});

describe("createPaymentIntent", () => {
  it("rejects without a session", async () => {
    await expect(createPaymentIntent()).rejects.toThrow(/Authentication required/i);
    expect(state.create).not.toHaveBeenCalled();
  });

  it("charges the fixed pack price and tags the intent with the buyer", async () => {
    state.cookie = "token-alice";
    await createPaymentIntent();
    expect(state.create).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 9999, currency: "usd", metadata: expect.objectContaining({ uid: "alice" }) })
    );
  });
});

describe("completePayment", () => {
  it("rejects without a session", async () => {
    await expect(completePayment("pi_123")).rejects.toThrow(/Authentication required/i);
  });

  it("refuses another user's payment and grants nothing", async () => {
    state.cookie = "token-alice";
    state.intent = intentFor("mallory");
    await expect(completePayment("pi_123")).rejects.toThrow(/different account/i);
    expect(db.docs.get(PROFILE)?.credits).toBe(50);
  });

  it("refuses unsucceeded or unexpected-amount intents", async () => {
    state.cookie = "token-alice";
    state.intent = intentFor("alice", { status: "processing" });
    await expect(completePayment("pi_123")).rejects.toThrow(/not successful/i);
    state.intent = intentFor("alice", { amount: 50 });
    await expect(completePayment("pi_123")).rejects.toThrow(/Unexpected payment amount/i);
    expect(db.docs.get(PROFILE)?.credits).toBe(50);
  });

  it("grants the pack once even when completed repeatedly", async () => {
    state.cookie = "token-alice";
    state.intent = intentFor("alice");
    const first = await completePayment("pi_123");
    const second = await completePayment("pi_123");
    expect(first).toMatchObject({ status: "success", credits: 10050 });
    expect(second.status).toBe("already");
    expect(db.docs.get(PROFILE)?.credits).toBe(10050);
    expect(db.docs.get("users/alice/payments/pi_123")).toMatchObject({ id: "pi_123", amount: 9999 });
  });

  it("treats a payment recorded by the old client flow as already applied", async () => {
    db.docs.set("users/alice/payments/autoid", { id: "pi_123", status: "succeeded" });
    state.cookie = "token-alice";
    state.intent = intentFor("alice");
    expect((await completePayment("pi_123")).status).toBe("already");
    expect(db.docs.get(PROFILE)?.credits).toBe(50);
  });

  it("rejects malformed payment references", async () => {
    state.cookie = "token-alice";
    await expect(completePayment("../users/x")).rejects.toThrow(/Invalid payment reference/i);
  });
});
