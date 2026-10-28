import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/sessionCookie";
import { verifyFirebaseIdToken } from "@/lib/server/firebaseIdToken";
import { isSessionTokenActive } from "@/lib/utils/authToken";

// Server-side route protection. Runs (per the matcher below) only on protected
// routes and redirects unauthenticated requests to the home page, where the
// sign-in flow lives. The session cookie is the HttpOnly Firebase ID token set
// by POST /api/session. A missing, expired, or badly signed token is rejected.
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token && isSessionTokenActive(token) && (await verifyFirebaseIdToken(token))) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/";
  redirectUrl.search = "";

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}

// Only run on the authenticated areas of the app. Public routes (/, terms,
// privacy, support, loginfinish, payment-*), API routes,
// Next.js internals, and static assets are intentionally not matched.
export const config = {
  matcher: [
    "/grader",
    "/grader/:path*",
    "/rubrics",
    "/rubrics/:path*",
    "/assignments",
    "/assignments/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/profile",
    "/profile/:path*",
    "/plagiarism-check",
    "/plagiarism-check/:path*",
  ],
};
