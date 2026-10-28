import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ signedIn: true }));

vi.mock("@/lib/server/requestAuth", () => ({
  requireServerUser: async () => {
    if (!state.signedIn) throw new Error("Authentication required.");
    return { uid: "alice" };
  },
}));

const { htmlToDocx } = await import("./htmlToDocx");

beforeEach(() => {
  state.signedIn = true;
});

describe("htmlToDocx", () => {
  it("requires a session before parsing", async () => {
    state.signedIn = false;
    await expect(htmlToDocx("<p>Hello</p>")).rejects.toThrow(/Authentication required/);
  });

  it("rejects an empty or oversized document", async () => {
    await expect(htmlToDocx("   ")).rejects.toThrow(/empty or too large/);
    await expect(htmlToDocx("a".repeat(1_000_001))).rejects.toThrow(/empty or too large/);
  });

  it("returns a docx for a short signed-in export", async () => {
    const base64 = await htmlToDocx("<p>Hello <strong>there</strong></p>");
    expect(base64.length).toBeGreaterThan(20);
  });
});