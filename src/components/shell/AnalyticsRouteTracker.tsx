"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { COOKIE_CONSENT_EVENT } from "@/lib/cookieConsent";

/**
 * Records a page_view for the current route, and again after the visitor
 * accepts the existing cookie notice or navigates on the client.
 */
export function AnalyticsRouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    const track = () => {
      void import("@/firebase/analytics").then(({ trackPageView }) => {
        if (active) return trackPageView(pathname);
      });
    };
    track();
    window.addEventListener(COOKIE_CONSENT_EVENT, track);
    return () => {
      active = false;
      window.removeEventListener(COOKIE_CONSENT_EVENT, track);
    };
  }, [pathname]);

  return null;
}
