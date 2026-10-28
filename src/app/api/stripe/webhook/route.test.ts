import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeAdminDb, type FakeAdminDb } from "@/lib/server/testing/fakeAdminDb";

const state = vi.hoisted(() => ({
  db: null as unknown,
  event: null as null | Record<string, unknown>,
  constructError: null as Error | null,
}));

vi.mock("firebase-admin/firestore", () => ({
  FieldValue: { increment: (n: number) => ({ __increment: n }) },
  Timestamp: { now: () => ({ toMillis: () => 0 }) },
}));
vi.mock("@/firebase/firebaseAdmin", () => ({
  get adminDb() {
    return state.db;
  },
}));
vi.mock("stripe", () => {
  class StripeMock {
    webhooks = {
      constructEvent: () => {
        if (state.constructError) throw state.constructError;
        return state.event;
      },
    };
  }
  return { default: StripeMock };
});

const { POST } = await import("./route");

let db: FakeAdminDb;
const PROFILE = "users/alice/profile/userData";

const succeeded = (overrides: Record<string, unknown> = {}) => ({
  type: "payment_intent.succeeded",
  data: {
    object: {
      id: "pi_123",
      amount: 9999,
      currency: "usd",
      created: 1_700_000_000,
      status: "succeeded",
      metadata: { uid: "alice" },
      ...overrides,
    },
  },
});

const send = () =>
  POST(
    new NextRequest("https://grade.example/api/stripe/webhook", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "{}",
    })
  );

beforeEach(() => {
  db = createFakeAdminDb({ [PROFILE]: { credits: 50 } });
  state.db = db;
  state.event = succeeded();
  state.constructError = null;
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  process.env.STRIPE_SECRET_KEY = "sk_test";
});

describe("POST /api/stripe/webhook", () => {
  it("does nothing when the webhook secret is unset", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const res = await send();
    expect(res.status).toBe(503);
    expect(db.docs.get(PROFILE)?.credits).toBe(50);
  });

  it("rejects a bad signature", async () => {
    state.constructError = new Error("bad sig");
    const res = await send();
    expect(res.status).toBe(400);
    expect(db.docs.get(PROFILE)?.credits).toBe(50);
  });

  it("grants the pack once for a succeeded credit-pack intent", async () => {
    expect((await send()).status).toBe(200);
    expect((await send()).status).toBe(200);
    expect(db.docs.get(PROFILE)?.credits).toBe(10050);
    expect(db.docs.get("users/alice/payments/pi_123")).toMatchObject({ mode: "stripe", amount: 9999 });
  });

  it("ignores a succeeded intent for a different amount", async () => {
    state.event = succeeded({ amount: 50 });
    const res = await send();
    expect(res.status).toBe(200);
    expect(db.docs.get(PROFILE)?.credits).toBe(50);
  });

  it("ignores a uid that is not a safe document id", async () => {
    state.event = succeeded({ metadata: { uid: "../admin" } });
    const res = await send();
    expect(res.status).toBe(200);
    expect(db.docs.get(PROFILE)?.credits).toBe(50);
  });
});
