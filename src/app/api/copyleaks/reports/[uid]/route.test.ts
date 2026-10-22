import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeAdminDb } from "@/lib/server/testing/fakeAdminDb";

const state = vi.hoisted(() => ({ db: null as unknown }));

vi.mock("@/firebase/firebaseAdmin", () => ({
  get adminDb() {
    return state.db;
  },
  adminAuth: { verifyIdToken: async (token: string) => ({ uid: token.replace("token-", "") }) },
}));

const { GET } = await import("./route");

const list = (uid: string, cookie?: string) =>
  GET(
    new NextRequest(`http://localhost/api/copyleaks/reports/${uid}`, {
      headers: cookie ? { cookie: `grademeAuthToken=${cookie}` } : {},
    }),
    { params: Promise.resolve({ uid }) }
  );

beforeEach(() => {
  state.db = createFakeAdminDb({
    "users/alice/plagiarism_reports/r1": { status: "completed", wordCount: 300 },
  });
});

describe("GET /api/copyleaks/reports/[uid]", () => {
  it("denies requests without a session", async () => {
    expect((await list("alice")).status).toBe(401);
  });

  it("denies reading another user's reports", async () => {
    expect((await list("alice", "token-bob")).status).toBe(403);
  });

  it("returns the owner's reports", async () => {
    const res = await list("alice", "token-alice");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([{ docId: "r1", status: "completed", wordCount: 300 }]);
  });

  it("returns an empty list (not 404) when there are no reports", async () => {
    const res = await list("carol", "token-carol");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });
});
