import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeAdminDb, type FakeAdminDb } from "@/lib/server/testing/fakeAdminDb";

const state = vi.hoisted(() => ({ db: null as unknown }));

vi.mock("firebase-admin/firestore", () => ({
  FieldValue: { increment: (n: number) => ({ __increment: n }) },
}));
vi.mock("@/firebase/firebaseAdmin", () => ({
  get adminDb() {
    return state.db;
  },
}));

const { POST } = await import("./route");

let db: FakeAdminDb;
const report = "users/u1/plagiarism_reports/doc1";
const profile = "users/u1/profile/userData";

const send = (status: string, body: unknown) =>
  POST(
    new NextRequest(`http://localhost/api/copyleaks/webhook/${status}`, {
      method: "POST",
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    { params: Promise.resolve({ status }) }
  );

beforeEach(() => {
  db = createFakeAdminDb({
    [report]: { status: "pending", creditCost: 30 },
    [profile]: { credits: 70 },
  });
  state.db = db;
});

describe("POST /api/copyleaks/webhook/[status]", () => {
  it("completes a pending report identified by developerPayload", async () => {
    const res = await send("completed", { developerPayload: "u1/doc1", results: { score: { aggregatedScore: 4 } } });
    expect(res.status).toBe(200);
    expect(db.docs.get(report)).toMatchObject({ status: "completed", results: { score: { aggregatedScore: 4 } } });
  });

  it("falls back to the uid-docId filename for scans submitted before developerPayload", async () => {
    const res = await send("completed", { scannedDocument: { metadata: { filename: "u1-doc1.txt" } }, results: {} });
    expect(res.status).toBe(200);
    expect(db.docs.get(report)?.status).toBe("completed");
  });

  it("marks a failed scan as error and refunds its credits once, even when retried", async () => {
    const body = { developerPayload: "u1/doc1", error: { message: "Scan timed out" } };
    expect((await send("error", body)).status).toBe(200);
    expect((await send("error", body)).status).toBe(200);
    expect(db.docs.get(report)).toMatchObject({ status: "error", error: "Scan timed out" });
    expect(db.docs.get(profile)?.credits).toBe(100);
  });

  it("does not overwrite a report that already finished", async () => {
    await send("completed", { developerPayload: "u1/doc1", results: { first: true } });
    await send("completed", { developerPayload: "u1/doc1", results: { second: true } });
    expect(db.docs.get(report)?.results).toEqual({ first: true });
  });

  it("acknowledges callbacks for unknown reports without creating them", async () => {
    const res = await send("completed", { developerPayload: "u1/nope", results: {} });
    expect(res.status).toBe(200);
    expect(db.docs.has("users/u1/plagiarism_reports/nope")).toBe(false);
  });

  it("rejects malformed bodies and payloads without report ids", async () => {
    expect((await send("completed", "{not json")).status).toBe(400);
    expect((await send("completed", { results: {} })).status).toBe(400);
    expect(db.docs.get(report)?.status).toBe("pending");
  });
});
