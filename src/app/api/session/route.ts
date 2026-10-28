import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/firebase/firebaseAdmin";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/sessionCookie";

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

function reject(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

/** Stores a verified Firebase ID token in an HttpOnly session cookie. */
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return reject(403, "Cross-origin session changes are not allowed.");
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return reject(415, "Expected JSON.");

  let token = "";
  try {
    const body = (await request.json()) as { token?: unknown };
    token = typeof body.token === "string" ? body.token : "";
  } catch {
    return reject(400, "Invalid JSON body.");
  }
  if (token.length < 20 || token.length > 8192) return reject(400, "Invalid session token.");
  if (typeof adminAuth.verifyIdToken !== "function") return reject(503, "Authentication is temporarily unavailable.");

  try {
    const decoded = (await adminAuth.verifyIdToken(token)) as { uid?: string };
    if (!decoded.uid) return reject(401, "Authentication required.");
  } catch {
    return reject(401, "Authentication required.");
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, cookieOptions());
  return response;
}

/** Clears the session cookie. Same-origin only, so another site cannot sign the user out. */
export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return reject(403, "Cross-origin session changes are not allowed.");
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", { ...cookieOptions(), maxAge: 0 });
  return response;
}
