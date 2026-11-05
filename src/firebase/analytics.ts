import type { Analytics } from "firebase/analytics";
import { app, hasClientConfig } from "@/firebase/firebaseClient";
import { pageViewParams, type PageViewParams } from "@/lib/analytics/pageView";
import { hasCookieConsent } from "@/lib/cookieConsent";

let startup: Promise<Analytics | null> | null = null;
let lastPagePath: string | null = null;
let trackGeneration = 0;
let logPageView: ((analytics: Analytics, params: PageViewParams) => void) | null = null;

function measurementId(): string {
  const configured = app?.options.measurementId;
  return typeof configured === "string" ? configured.trim() : "";
}

/**
 * Starts Firebase Analytics once, after cookie consent.
 * Automatic page_view is off so each client route is logged exactly once.
 */
async function startAnalytics(): Promise<Analytics | null> {
  if (!hasClientConfig || !app || !measurementId()) return null;
  const { getAnalytics, initializeAnalytics, isSupported, logEvent } = await import(
    "firebase/analytics"
  );
  if (!(await isSupported())) return null;
  initializeAnalytics(app, { config: { send_page_view: false } });
  const analytics = getAnalytics(app);
  logPageView = (instance, params) => logEvent(instance, "page_view", params);
  return analytics;
}

function ensureAnalytics(): Promise<Analytics | null> {
  if (!hasCookieConsent() || !hasClientConfig || !app || !measurementId()) {
    return Promise.resolve(null);
  }
  if (!startup) {
    startup = startAnalytics().catch((error: unknown) => {
      console.error("Firebase Analytics failed to start", error);
      startup = null;
      return null;
    });
  }
  return startup;
}

/** Logs a GA4 page_view when consent and a measurement id are present. */
export async function trackPageView(pathname: string): Promise<void> {
  if (typeof window === "undefined" || !hasCookieConsent()) return;
  const generation = ++trackGeneration;
  const analytics = await ensureAnalytics();
  if (!analytics || !logPageView || generation !== trackGeneration) return;

  const params = pageViewParams(
    pathname,
    window.location.search,
    window.location.href,
    document.title,
  );
  if (params.page_path === lastPagePath || generation !== trackGeneration) return;
  lastPagePath = params.page_path;
  logPageView(analytics, params);
}
