import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  cookie: undefined as string | undefined,
  calls: [] as string[],
  failStorage: false,
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => (state.cookie ? { value: state.cookie } : undefined) }),
}));
vi.mock("@/firebase/firebaseAdmin", () => ({
  adminDb: {
    doc: (path: string) => ({ path }),
    recursiveDelete: async (ref: { path: string }) => void state.calls.push(`firestore:${ref.path}`),
  },
  adminBucket: {
    deleteFiles: async ({ prefix }: { prefix: string }) => {
      if (state.failStorage) throw new Error("storage unavailable");
      state.calls.push(`storage:${prefix}`);
    },
  },
  adminAuth: {
    verifyIdToken: async (token: string) => {
      if (!token.startsWith("token-")) throw new Error("auth/argument-error");
      return { uid: token.replace("token-", "") };
    },
    deleteUser: async (uid: string) => void state.calls.push(`auth:${uid}`),
  },
}));

const { deleteAccountData } = await import("./deleteAccount");

beforeEach(() => {
  state.cookie = undefined;
  state.calls = [];
  state.failStorage = false;
});

describe("deleteAccountData", () => {
  it("rejects without a valid session and deletes nothing", async () => {
    await expect(deleteAccountData()).rejects.toThrow();
    state.cookie = "forged";
    await expect(deleteAccountData()).rejects.toThrow();
    expect(state.calls).toEqual([]);
  });

  it("deletes only the session user's data, uploads, then auth account", async () => {
    state.cookie = "token-alice";
    await expect(deleteAccountData()).resolves.toEqual({ ok: true });
    expect(state.calls).toEqual(["firestore:users/alice", "storage:uploads/alice/", "auth:alice"]);
  });

  it("keeps the auth account when an earlier step fails so the user can retry", async () => {
    state.cookie = "token-alice";
    state.failStorage = true;
    await expect(deleteAccountData()).rejects.toThrow(/storage unavailable/);
    expect(state.calls).toEqual(["firestore:users/alice"]);
  });
});
