"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Same cookie name react-cookie-consent used, so existing users are not re-prompted.
const COOKIE = "CookieConsent";

const hasConsent = () =>
  document.cookie.split("; ").some((c) => c === `${COOKIE}=true`);

export function CookieBanner() {
  const [accepted, setAccepted] = useState(false);
  const shouldAsk = useSyncExternalStore(
    () => () => {},
    () => !window.ReactNativeWebView && !hasConsent(),
    () => false
  );

  if (!shouldAsk || accepted) return null;

  const accept = () => {
    document.cookie = `${COOKIE}=true; path=/; max-age=31536000; samesite=lax`;
    setAccepted(true);
  };

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-[calc(var(--tabbar-height)+0.75rem)] z-50 mx-auto flex max-w-xl flex-col gap-3 rounded-xl border border-border bg-surface p-4 text-sm shadow-raised sm:flex-row sm:items-center md:bottom-4"
    >
      <p className="flex-1 text-muted-foreground">
        Grade.me uses cookies to keep you signed in and improve the app.{" "}
        <Link href="/privacy" className="text-foreground underline underline-offset-2">
          Learn more
        </Link>
      </p>
      <Button size="sm" onClick={accept}>
        Got it
      </Button>
    </div>
  );
}
