/** Name of the Firebase ID-token session cookie. HttpOnly; set only by /api/session. */
export const SESSION_COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "grademeAuthToken";

export const SESSION_MAX_AGE_SECONDS = 60 * 60;
