import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ valid: true, calls: 0 }));

vi.mock("@/lib/server/firebaseIdToken", () => ({
  verifyFirebaseIdToken: async () => {
    state.calls += 1;
    return state.valid;
  },
}));

const { proxy } = await import("./proxy");

function token(exp: number): string {
  const part = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${part({ alg: "RS256", kid: "k" })}.${part({ exp, sub: "alice" })}.sig`;
}

const request = (value?: string) => {
  const headers = new Headers();
  if (value) headers.set("cookie", `grademeAuthToken=${value}`);
  return new NextRequest("https://grade.example/grader", { headers });
};

beforeEach(() => {
  state.valid = true;
  state.calls = 0;
});

describe("proxy", () => {
  it("allows a structurally valid token whose signature verifies", async () => {
    const response = await proxy(request(token(Math.floor(Date.now() / 1000) + 600)));
    expect(response.headers.get("location")).toBeNull();
    expect(state.calls).toBe(1);
  });

  it("redirects and clears the cookie when the signature does not verify", async () => {
    state.valid = false;
    const response = await proxy(request(token(Math.floor(Date.now() / 1000) + 600)));
    expect(response.headers.get("location")).toBe("https://grade.example/");
    expect(response.cookies.get("grademeAuthToken")?.value).toBe("");
  });

  it("does not fetch signing keys for an expired token", async () => {
    const response = await proxy(request(token(Math.floor(Date.now() / 1000) - 120)));
    expect(response.headers.get("location")).toBe("https://grade.example/");
    expect(state.calls).toBe(0);
  });
});
