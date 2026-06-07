// Edge-safe helpers for validating the Firebase ID-token session cookie.
//
// The session cookie holds a Firebase ID token (a JWT). The proxy uses these
// helpers to gate protected routes server-side. This performs a lightweight,
// signature-less expiry/structure check that is safe to run in the Edge runtime
// (no Node APIs, no network). Cryptographic verification of the signature still
// happens on the client (Firebase SDK) and should be added server-side in API
// handlers for authoritative authorization (see spec.md).

interface JwtPayload {
  exp?: number;
}

function decodeBase64Url(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return atob(padded);
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(decodeBase64Url(parts[1])) as JwtPayload;
  } catch {
    return null;
  }
}

// Returns true when the token is a structurally valid JWT whose `exp` claim is
// still in the future (with a small leeway to tolerate minor clock skew between
// the client that minted the cookie and the server evaluating it).
export function isSessionTokenActive(
  token: string | undefined | null,
  nowMs: number = Date.now()
): boolean {
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;

  const leewaySeconds = 60;
  const nowSeconds = Math.floor(nowMs / 1000);
  return payload.exp + leewaySeconds > nowSeconds;
}
