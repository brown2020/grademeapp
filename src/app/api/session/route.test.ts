import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ accept: true }));

vi.mock("@/firebase/firebaseAdmin", () => ({
  adminAuth: {
    verifyIdToken: async (token: string) => {
      if (!state.accept || token === "rejected-token-value") throw new Error("bad");
      return { uid: "alice" };
    },
  },
}));

const { DELETE, POST } = await import("./route");

const TOKEN = "a".repeat(40);

const post = (init: { origin?: string; token?: string; json?: boolean } = {}) =>
  POST(
    new NextRequest("https://grade.example/api/session", {
      method: "POST",
      headers: {
        ...(init.origin ? { origin: init.origin } : {}),
        ...(init.json === false ? {} : { "content-type": "application/json" }),
      },
      body: JSON.stringify({ token: init.token ?? TOKEN }),
    })
  );

beforeEach(() => {
  state.accept = true;
});

describe("/api/session", () => {
  it("sets an httpOnly cookie after the token verifies", async () => {
    const res = await post({ origin: "https://grade.example" });
    expect(res.status).toBe(200);
    const cookie = res.cookies.get("grademeAuthToken");
    expect(cookie?.value).toBe(TOKEN);
    expect(cookie?.httpOnly).toBe(true);
  });

  it("rejects a missing origin, a foreign origin, and a bad token", async () => {
    expect((await post()).status).toBe(403);
    expect((await post({ origin: "https://evil.example" })).status).toBe(403);
    state.accept = false;
    expect((await post({ origin: "https://grade.example" })).status).toBe(401);
    expect((await post({ origin: "https://grade.example", token: "short" })).status).toBe(400);
  });

  it("clears the cookie on a same-origin DELETE", async () => {
    const res = await DELETE(
      new NextRequest("https://grade.example/api/session", {
        method: "DELETE",
        headers: { origin: "https://grade.example" },
      })
    );
    expect(res.status).toBe(200);
    expect(res.cookies.get("grademeAuthToken")?.value).toBe("");
  });
});
