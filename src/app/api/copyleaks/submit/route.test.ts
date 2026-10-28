import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeAdminDb, type FakeAdminDb } from "@/lib/server/testing/fakeAdminDb";

const state = vi.hoisted(() => ({ db: null as unknown }));

vi.mock("firebase-admin/firestore", () => ({
  FieldValue: { increment: (n: number) => ({ __increment: n }) },
}));
vi.mock("@/firebase/firebaseAdmin", () => ({
  get adminDb() {
    return state.db;
  },
  adminAuth: {
    verifyIdToken: async (token: string) => {
      if (!token.startsWith("token-")) throw new Error("auth/argument-error");
      return { uid: token.replace("token-", "") };
    },
  },
}));

const { POST } = await import("./route");

let db: FakeAdminDb;
let fetchMock: ReturnType<typeof vi.fn>;
const profileOf = (uid: string) => `users/${uid}/profile/userData`;

const submit = (body: Record<string, unknown>, cookie?: string) =>
  POST(
    new NextRequest("http://localhost/api/copyleaks/submit", {
      method: "POST",
      body: JSON.stringify(body),
      headers: cookie ? { cookie: `grademeAuthToken=${cookie}` } : {},
    })
  );

const okFetch = () =>
  vi.fn(async (url: string) =>
    String(url).includes("login")
      ? new Response(JSON.stringify({ access_token: "t" }), { status: 200 })
      : new Response("{}", { status: 201 })
  );

beforeEach(() => {
  db = createFakeAdminDb({
    [profileOf("alice")]: { credits: 500 },
    [profileOf("bob")]: { credits: 500 },
    [profileOf("broke")]: { credits: 0 },
  });
  state.db = db;
  fetchMock = okFetch();
  vi.stubGlobal("fetch", fetchMock);
  process.env.BASE_URL = "https://grade.example";
  process.env.COPYLEAKS_WEBHOOK_SECRET = "hook-secret";
  process.env.COPYLEAKS_API_KEY = "key";
  process.env.COPYLEAKS_EMAIL = "scan@example.com";
});

afterEach(() => vi.unstubAllGlobals());

describe("POST /api/copyleaks/submit", () => {
  it("returns 401 without a session and charges nobody", async () => {
    const res = await submit({ uid: "alice", text: "some words here" });
    expect(res.status).toBe(401);
    expect(db.docs.get(profileOf("alice"))?.credits).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 403 when the session belongs to another user", async () => {
    const res = await submit({ uid: "alice", text: "some words here" }, "token-bob");
    expect(res.status).toBe(403);
    expect(db.docs.get(profileOf("alice"))?.credits).toBe(500);
    expect(db.docs.get(profileOf("bob"))?.credits).toBe(500);
  });

  it("returns 402 before calling Copyleaks when credits are short", async () => {
    const res = await submit({ uid: "broke", text: "some words here" }, "token-broke");
    expect(res.status).toBe(402);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("debits on the server and returns the new balance", async () => {
    const res = await submit({ uid: "alice", text: "some words here" }, "token-alice");
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.credits).toBe(500 - body.creditsUsed);
    expect(db.docs.get(profileOf("alice"))?.credits).toBe(body.credits);
    expect(db.docs.get(`users/alice/plagiarism_reports/${body.docId}`)).toMatchObject({ status: "pending" });
  });

  it("refunds the debit and marks the report when Copyleaks rejects the scan", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      String(url).includes("login")
        ? new Response(JSON.stringify({ access_token: "t" }), { status: 200 })
        : new Response(JSON.stringify({ message: "rejected" }), { status: 400 })
    );
    const res = await submit({ uid: "alice", text: "some words here" }, "token-alice");
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Internal Server Error" });
    expect(db.docs.get(profileOf("alice"))?.credits).toBe(500);
    const reports = [...db.docs.entries()].filter(([path]) => path.startsWith("users/alice/plagiarism_reports/"));
    expect(reports).toHaveLength(1);
    expect(reports[0]?.[1]).toMatchObject({ status: "error" });
  });

  it("refuses a scan before charging when the webhook secret is unset", async () => {
    delete process.env.COPYLEAKS_WEBHOOK_SECRET;
    const res = await submit({ uid: "alice", text: "some words here" }, "token-alice");
    expect(res.status).toBe(503);
    expect(db.docs.get(profileOf("alice"))?.credits).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
