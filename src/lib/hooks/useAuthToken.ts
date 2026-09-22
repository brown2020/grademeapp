import { useEffect, useRef } from "react";
import { getIdToken } from "firebase/auth";
import { deleteCookie, setCookie } from "cookies-next";
import debounce from "lodash/debounce";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAuthStore } from "@/zustand/useAuthStore";
import { auth, hasClientConfig } from "@/firebase/firebaseClient";

const useAuthToken = (cookieName = "authToken") => {
  const [user, loading, error] = useAuthState(auth);
  const setAuthDetails = useAuthStore((state) => state.setAuthDetails);
  const clearAuthDetails = useAuthStore((state) => state.clearAuthDetails);

  const refreshInterval = 50 * 60 * 1000; // 50 minutes
  const lastTokenRefresh = `lastTokenRefresh_${cookieName}`;
  const activityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshAuthTokenRef = useRef(async () => {
    try {
      if (!hasClientConfig || !auth.currentUser) throw new Error("No user found");
      const idTokenResult = await getIdToken(auth.currentUser, true);

      setCookie(cookieName, idTokenResult, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      if (!window.ReactNativeWebView) {
        window.localStorage.setItem(lastTokenRefresh, Date.now().toString());
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Error refreshing token");
      }
      deleteCookie(cookieName, { path: "/" });
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

  useEffect(() => {
    if (user?.uid) {
      setAuthDetails({
        uid: user.uid,
        authEmail: user.email || "",
        authDisplayName: user.displayName || "",
        authPhotoUrl: user.photoURL || "",
        authEmailVerified: user.emailVerified || false,
        authReady: true,
        authPending: false,
      });

      getIdToken(user)
        .then((idToken) => {
          setCookie(cookieName, idToken, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        })
        .catch((error: unknown) => {
          console.error(
            error instanceof Error ? error.message : "Error setting auth cookie"
          );
        });
    } else {
      clearAuthDetails();
      deleteCookie(cookieName, { path: "/" });
    }
  }, [clearAuthDetails, cookieName, setAuthDetails, user]);

  return { uid: user?.uid, loading, error };
};

export default useAuthToken;
