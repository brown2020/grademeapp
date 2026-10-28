// Edge-safe helpers for validating the Firebase ID-token session cookie.
//
// The session cookie holds a Firebase ID token (a JWT). These helpers are a
// fast, signature-less expiry check that is safe in the Edge runtime. The proxy
// also verifies the RS256 signature (`firebaseIdToken.ts`) before allowing a
// protected route. API handlers verify the same cookie with the Admin SDK.

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
