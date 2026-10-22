import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeAdminDb, type FakeAdminDb } from "@/lib/server/testing/fakeAdminDb";

const state = vi.hoisted(() => ({ db: null as unknown, cookie: undefined as string | undefined }));

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => (state.cookie ? { value: state.cookie } : undefined) }),
}));
vi.mock("firebase-admin/firestore", () => ({
  FieldValue: { increment: (n: number) => ({ __increment: n }) },
}));
vi.mock("@/firebase/firebaseAdmin", () => ({
  get adminDb() {
    return state.db;
  },
  adminAuth: { verifyIdToken: async (token: string) => ({ uid: token.replace("token-", "") }) },
}));

const { ensureProfile } = await import("./profileActions");
const { STARTER_CREDITS } = await import("@/lib/server/billing");

let db: FakeAdminDb;
const identity = { email: "a@example.com", displayName: "Alice", photoUrl: "", emailVerified: true };

beforeEach(() => {
  db = createFakeAdminDb();
  state.db = db;
  state.cookie = undefined;
});

describe("ensureProfile", () => {
  it("rejects without a session", async () => {
    await expect(ensureProfile(identity)).rejects.toThrow();
    expect(db.docs.size).toBe(0);
  });

  it("creates the caller's profile with the starter balance", async () => {
    state.cookie = "token-alice";
    const profile = await ensureProfile(identity);
    expect(profile).toMatchObject({ email: "a@example.com", credits: STARTER_CREDITS, useCredits: true });
    expect(db.docs.get("users/alice/profile/userData")?.credits).toBe(STARTER_CREDITS);
  });

  it("never resets an existing balance", async () => {
    state.cookie = "token-alice";
    db.docs.set("users/alice/profile/userData", { credits: 3, identity: "student" });
    const profile = await ensureProfile(identity);
    expect(profile).toMatchObject({ credits: 3, identity: "student" });
    expect(db.docs.get("users/alice/profile/userData")?.credits).toBe(3);
  });

  it("ignores client-supplied credits", async () => {
    state.cookie = "token-alice";
    await ensureProfile({ ...identity, credits: 999_999 });
    expect(db.docs.get("users/alice/profile/userData")?.credits).toBe(STARTER_CREDITS);
  });
});
