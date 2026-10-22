import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeAdminDb, type FakeAdminDb } from "./testing/fakeAdminDb";

const state = vi.hoisted(() => ({ db: null as unknown }));

vi.mock("firebase-admin/firestore", () => ({
  FieldValue: { increment: (n: number) => ({ __increment: n }) },
}));
vi.mock("@/firebase/firebaseAdmin", () => ({
  get adminDb() {
    return state.db;
  },
}));

const { debitCredits, getBilling, InsufficientCreditsError, refundCredits } = await import("./billing");

const PROFILE = "users/u1/profile/userData";
let db: FakeAdminDb;

beforeEach(() => {
  db = createFakeAdminDb({
    [PROFILE]: { credits: 100, useCredits: true, openai_api_key: "sk-x", fireworks_api_key: "" },
  });
  state.db = db;
});

describe("getBilling", () => {
  it("reads balance, mode and keys from the server profile", async () => {
    expect(await getBilling("u1")).toEqual({
      credits: 100,
      useCredits: true,
      openaiApiKey: "sk-x",
      fireworksApiKey: "",
    });
  });

  it("defaults safely when the profile is missing", async () => {
    expect(await getBilling("nobody")).toEqual({
      credits: 0,
      useCredits: true,
      openaiApiKey: "",
      fireworksApiKey: "",
    });
  });
});

describe("debitCredits", () => {
  it("debits and returns the new balance", async () => {
    expect(await debitCredits("u1", 30)).toBe(70);
    expect(db.docs.get(PROFILE)?.credits).toBe(70);
  });

  it("rejects a short balance without writing", async () => {
    await expect(debitCredits("u1", 150)).rejects.toBeInstanceOf(InsufficientCreditsError);
    expect(db.docs.get(PROFILE)?.credits).toBe(100);
  });

  it("clamps at zero when partial debits are allowed", async () => {
    expect(await debitCredits("u1", 150, { allowPartial: true })).toBe(0);
    expect(db.docs.get(PROFILE)?.credits).toBe(0);
  });

  it("never lets two debits overspend one balance", async () => {
    await debitCredits("u1", 60);
    await expect(debitCredits("u1", 60)).rejects.toBeInstanceOf(InsufficientCreditsError);
    expect(db.docs.get(PROFILE)?.credits).toBe(40);
  });

  it("ignores non-positive amounts", async () => {
    expect(await debitCredits("u1", 0)).toBe(100);
    expect(await debitCredits("u1", -5)).toBe(100);
  });
});

describe("refundCredits", () => {
  it("adds the amount back", async () => {
    await refundCredits("u1", 25);
    expect(db.docs.get(PROFILE)?.credits).toBe(125);
  });
});
