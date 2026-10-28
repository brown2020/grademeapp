import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import { resetUserScopedStores } from "@/zustand/userScope";

/** Clears the HttpOnly session cookie before Firebase sign-out. */
export async function signOutUser() {
  await fetch("/api/session", { method: "DELETE" }).catch((error: unknown) => {
    console.error("Failed to clear the session cookie:", error);
  });
  await signOut(auth);
  useAuthStore.getState().clearAuthDetails();
  resetUserScopedStores();
  if (typeof window !== "undefined") {
    sessionStorage.clear();
  }
}
