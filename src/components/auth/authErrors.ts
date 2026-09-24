export function isFirebaseError(
  error: unknown
): error is { code: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}

const MESSAGES: Record<string, string> = {
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect password. Try again or reset it.",
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/too-many-requests": "Too many attempts. Please wait and try again.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/network-request-failed": "Network error. Check your connection.",
  "auth/missing-email": "Please enter your email address.",
  "auth/invalid-action-code": "This link is invalid or has expired.",
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/cancelled-popup-request": "Sign-in was cancelled.",
};

export function authErrorMessage(error: unknown): string {
  if (!isFirebaseError(error)) return "Something went wrong. Please try again.";
  return MESSAGES[error.code] ?? "Unable to authenticate. Please try again.";
}
