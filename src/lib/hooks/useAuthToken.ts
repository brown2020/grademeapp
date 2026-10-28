import { useEffect, useRef, useState } from "react";
import { getIdToken } from "firebase/auth";
import debounce from "lodash/debounce";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAuthStore } from "@/zustand/useAuthStore";
import { resetUserScopedStores } from "@/zustand/userScope";
import { auth, hasClientConfig } from "@/firebase/firebaseClient";
import { logAuthFailure } from "@/components/auth/authErrors";

const COOKIE_SYNC_TIMEOUT_MS = 10_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

async function publishSession(idToken: string): Promise<void> {
  const response = await fetch("/api/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token: idToken }),
  });
  if (!response.ok) throw new Error("Session cookie was not accepted.");
}

const useAuthToken = () => {
  const [user, loading, error] = useAuthState(auth);
  const setAuthDetails = useAuthStore((state) => state.setAuthDetails);
  const clearAuthDetails = useAuthStore((state) => state.clearAuthDetails);

  const refreshInterval = 50 * 60 * 1000; // 50 minutes
  const lastTokenRefresh = "lastTokenRefresh";
  const activityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshAuthTokenRef = useRef(async () => {
    try {
      if (!hasClientConfig || !auth.currentUser) throw new Error("No user found");
      const idTokenResult = await getIdToken(auth.currentUser, true);
      await publishSession(idTokenResult);
      if (!window.ReactNativeWebView) {
        window.localStorage.setItem(lastTokenRefresh, Date.now().toString());
      }
    } catch (error: unknown) {
      // Keep the existing cookie. A failed refresh must not sign the user out.
      logAuthFailure("token refresh", error);
    }
  });

  const scheduleTokenRefreshRef = useRef(() => {
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }
    if (document.visibilityState === "visible") {
      activityTimeoutRef.current = setTimeout(() => {
        void refreshAuthTokenRef.current();
      }, refreshInterval);
    }
  });

  useEffect(() => {
    const handleStorageChange = debounce((e: StorageEvent) => {
      if (e.key === lastTokenRefresh) {
        scheduleTokenRefreshRef.current();
      }
    }, 1000);

    if (!window.ReactNativeWebView) {
      window.addEventListener("storage", handleStorageChange);
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      handleStorageChange.cancel();
    };
  }, [lastTokenRefresh]);

  // uid whose session cookie has been written (or attempted) for the current user.
  const [syncedUid, setSyncedUid] = useState<string | null>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    // While Firebase restores a persisted session `user` is null; deleting the cookie
    // here would make the first server requests after load unauthenticated.
    if (loading) return;

    if (!user) {
      const hadSession = Boolean(useAuthStore.getState().uid);
      clearAuthDetails();
      resetUserScopedStores();
      if (hadSession) {
        void fetch("/api/session", { method: "DELETE" }).catch((error: unknown) => {
          console.error("Failed to clear the session cookie:", error);
        });
      }
      return;
    }

    let cancelled = false;
    withTimeout(getIdToken(user), COOKIE_SYNC_TIMEOUT_MS)
      .then((idToken) => publishSession(idToken))
      .then(() => {
        if (cancelled) return;
        const previousUid = useAuthStore.getState().uid;
        if (previousUid && previousUid !== user.uid) resetUserScopedStores();
        // Publishing the uid only after the cookie exists keeps signed-in UI (and the
        // requests it makes) from running ahead of the server session.
        setAuthDetails({
          uid: user.uid,
          authEmail: user.email || "",
          authDisplayName: user.displayName || "",
          authPhotoUrl: user.photoURL || "",
          authEmailVerified: user.emailVerified || false,
          authReady: true,
          authPending: false,
        });
        setSyncedUid(user.uid);
      })
      .catch((error: unknown) => {
        logAuthFailure("session cookie", error);
        if (!cancelled) setSyncedUid(user.uid);
      });

    return () => {
      cancelled = true;
    };
  }, [clearAuthDetails, loading, setAuthDetails, user]);

  const sessionReady = !loading && (!user || syncedUid === user.uid);
  if (sessionReady && !settled) setSettled(true);

  return { uid: user?.uid, loading: !settled, error };
};

export default useAuthToken;
