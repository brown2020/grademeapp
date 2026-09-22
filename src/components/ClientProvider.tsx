"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import CookieConsent from "react-cookie-consent";

import useAuthToken from "@/lib/hooks/useAuthToken";
import { useInitializeStores } from "@/zustand/useInitializeStores";
import ErrorBoundary from "./ErrorBoundary";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const { loading } = useAuthToken(process.env.NEXT_PUBLIC_COOKIE_NAME!);
  useInitializeStores();
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    function adjustHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    window.addEventListener("resize", adjustHeight);
    window.addEventListener("orientationchange", adjustHeight);
    adjustHeight();

    return () => {
      window.removeEventListener("resize", adjustHeight);
      window.removeEventListener("orientationchange", adjustHeight);
    };
  }, []);

  useEffect(() => {
    const inRnWebView = Boolean(window.ReactNativeWebView);
    setShowCookieConsent(!inRnWebView);
    if (inRnWebView) {
      document.body.classList.add("noscroll");
    } else {
      document.body.classList.remove("noscroll");
    }

    return () => {
      document.body.classList.remove("noscroll");
    };
  }, []);

  if (loading)
    return (
      <ErrorBoundary>
        <div
          className={`flex flex-col items-center justify-center h-full bg-[#333b51]`}
        >
          <ClipLoader color="#fff" size={80} />
        </div>
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full">
        {children}
        {showCookieConsent && (
          <CookieConsent>
            This app uses cookies to enhance the user experience.
          </CookieConsent>
        )}
        <Toaster
          position="bottom-center"
          gutter={0}
          toastOptions={{
            duration: 3000,
            style: {
              position: "relative",
              bottom: "0",
              left: "0",
              width: "100%",
              height: "30%",
              background: "#FFFFFF",
              color: "#000000",
              fontFamily: "Poppins",
              fontSize: "1rem",
              fontWeight: "700",
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}
