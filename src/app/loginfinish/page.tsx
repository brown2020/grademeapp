"use client";

import { useAuthStore } from "@/zustand/useAuthStore";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import useProfileStore from "@/zustand/useProfileStore";
import { authErrorMessage, isFirebaseError, logAuthFailure } from "@/components/auth/authErrors";
import { EMAIL_LINK_STORAGE } from "@/components/auth/authActions";

export default function LoginFinishPage() {
  const router = useRouter();
  const setAuthDetails = useAuthStore((s) => s.setAuthDetails);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  useEffect(() => {
    async function attemptSignIn() {
      try {
        if (!isSignInWithEmailLink(auth, window.location.href)) {
          throw new Error("Sign in link is not valid");
        }

        let email = window.localStorage.getItem(EMAIL_LINK_STORAGE.email);
        const name = window.localStorage.getItem(EMAIL_LINK_STORAGE.name) || "";

        if (!email) {
          email = window.prompt("Please confirm your email");
          if (!email) {
            throw new Error("Email confirmation cancelled by user");
          }
        }

        const userCredential = await signInWithEmailLink(
          auth,
          email,
          window.location.href
        );

        const user = userCredential.user;
        const authEmail = user?.email;
        const uid = user?.uid;
        const selectedName = name || user?.displayName || "";

        if (!uid || !authEmail) {
          throw new Error("No user found");
        }

        setAuthDetails({
          uid,
          authEmail,
          authDisplayName: selectedName,
        });
        updateProfile({ displayName: selectedName });
      } catch (error) {
        logAuthFailure("email link sign-in", error);
        alert(
          isFirebaseError(error)
            ? authErrorMessage(error)
            : error instanceof Error
              ? error.message
              : "Couldn't finish signing in. Please try again."
        );
      } finally {
        window.localStorage.removeItem(EMAIL_LINK_STORAGE.email);
        window.localStorage.removeItem(EMAIL_LINK_STORAGE.name);
        window.location.assign("/");
      }
    }

    attemptSignIn();
  }, [router, setAuthDetails, updateProfile]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-muted-foreground">
      <Loader2 className="size-6 animate-spin" aria-hidden />
      <p>Completing sign-in…</p>
    </div>
  );
}
