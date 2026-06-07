import { describe, it, expect } from "vitest";
import { isSessionTokenActive, decodeJwtPayload } from "@/lib/utils/authToken";

// Build a JWT-shaped token with the given payload (signature is irrelevant here;
// the proxy only checks structure + expiry, not the signature).
function makeToken(payload: Record<string, unknown>): string {
  const b64url = (obj: Record<string, unknown>) =>
    Buffer.from(JSON.stringify(obj))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  return `${b64url({ alg: "RS256", typ: "JWT" })}.${b64url(payload)}.sig`;
}

const NOW = 1_000_000_000_000; // fixed "now" in ms
const nowSec = Math.floor(NOW / 1000);

describe("decodeJwtPayload", () => {
  it("decodes a base64url-encoded payload", () => {
    const token = makeToken({ exp: nowSec, sub: "user-123" });
    expect(decodeJwtPayload(token)).toMatchObject({ sub: "user-123" });
  });

  it("returns null for a non-JWT string", () => {
    expect(decodeJwtPayload("not-a-jwt")).toBeNull();
  });
});

describe("isSessionTokenActive", () => {
  it("returns false for missing/empty tokens", () => {
    expect(isSessionTokenActive(undefined, NOW)).toBe(false);
    expect(isSessionTokenActive(null, NOW)).toBe(false);
    expect(isSessionTokenActive("", NOW)).toBe(false);
  });

  it("returns false for a malformed token", () => {
    expect(isSessionTokenActive("a.b", NOW)).toBe(false);
    expect(isSessionTokenActive("garbage", NOW)).toBe(false);
  });

  it("returns false when the exp claim is missing", () => {
    expect(isSessionTokenActive(makeToken({ sub: "x" }), NOW)).toBe(false);
  });

  it("returns true for a token expiring in the future", () => {
    expect(isSessionTokenActive(makeToken({ exp: nowSec + 3600 }), NOW)).toBe(
      true
    );
  });

  it("returns false for a clearly expired token", () => {
    expect(isSessionTokenActive(makeToken({ exp: nowSec - 3600 }), NOW)).toBe(
      false
    );
  });

  it("allows a small leeway for minor clock skew", () => {
    // expired 30s ago, within the 60s leeway -> still considered active
    expect(isSessionTokenActive(makeToken({ exp: nowSec - 30 }), NOW)).toBe(
      true
    );
  });
});
