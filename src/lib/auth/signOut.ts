import { signOut } from "firebase/auth";
import { deleteCookie } from "cookies-next";
import { auth } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";

/** Clears the session cookie before Firebase sign-out so the proxy never sees a stale token. */
export async function signOutUser() {
  const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || "authToken";
  deleteCookie(cookieName, { path: "/" });
  await signOut(auth);
  useAuthStore.getState().clearAuthDetails();
  if (typeof window !== "undefined") {
    sessionStorage.clear();
  }
}
