import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/firebase/firebaseAdmin";

const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "grademeAuthToken";

type RequestAuthResult =
  | { ok: true; uid: string }
  | { ok: false; response: NextResponse };

export class UnauthorizedError extends Error {
  constructor(message = "Authentication required.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/** Verify the Firebase ID-token cookie for Server Actions (no NextRequest). */
export async function requireServerUser(): Promise<{ uid: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    throw new UnauthorizedError();
  }
  if (typeof adminAuth.verifyIdToken !== "function") {
    throw new Error("Authentication is temporarily unavailable.");
  }
  try {
    const decoded = (await adminAuth.verifyIdToken(token)) as { uid?: string };
    if (!decoded.uid) {
      throw new UnauthorizedError();
    }
    return { uid: decoded.uid };
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    throw new UnauthorizedError("Authentication required.");
  }
}

export async function requireMatchingUid(
  request: NextRequest,
  expectedUid: string
): Promise<RequestAuthResult> {
  if (!expectedUid) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "User ID (uid) is required." },
        { status: 400 }
      ),
    };
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      ),
    };
  }

  if (typeof adminAuth.verifyIdToken !== "function") {
    console.error("Firebase Admin Auth is not initialized.");
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Authentication is temporarily unavailable." },
        { status: 500 }
      ),
    };
  }

  try {
    const decodedToken = (await adminAuth.verifyIdToken(token)) as {
      uid?: string;
    };

    if (decodedToken.uid !== expectedUid) {
      return {
        ok: false,
        response: NextResponse.json({ error: "Forbidden." }, { status: 403 }),
      };
    }

    return { ok: true, uid: decodedToken.uid };
  } catch (error) {
    console.error("Failed to verify request session:", error);
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      ),
    };
  }
}
