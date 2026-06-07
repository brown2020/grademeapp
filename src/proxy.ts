import { NextRequest, NextResponse } from "next/server";
import { isSessionTokenActive } from "@/lib/utils/authToken";

const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "grademeAuthToken";

// Server-side route protection. Runs (per the matcher below) only on protected
// routes and redirects unauthenticated requests to the home page, where the
// sign-in flow lives. Authentication state is read from the Firebase ID-token
// session cookie set by `useAuthToken` on sign-in.
export function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (isSessionTokenActive(token)) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/";
  redirectUrl.search = "";

  const response = NextResponse.redirect(redirectUrl);
  // Clear a stale/expired session cookie so the client re-establishes it.
  response.cookies.delete(COOKIE_NAME);
  return response;
}

// Only run on the authenticated areas of the app. Public routes (/, terms,
// privacy, support, loginfinish, payment-*, plagiarism-check), API routes,
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
  ],
};
