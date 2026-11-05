/** Same cookie name react-cookie-consent used, so existing opt-ins still count. */
export const COOKIE_CONSENT_NAME = "CookieConsent";

/** Fired after the visitor accepts the existing cookie notice. */
export const COOKIE_CONSENT_EVENT = "grademe:cookie-consent";

const CONSENT_PAIR = `${COOKIE_CONSENT_NAME}=true`;

/** True when the cookie jar already contains an explicit accept. */
export function hasCookieConsentValue(cookie: string): boolean {
  return cookie.split("; ").some((part) => part === CONSENT_PAIR);
}

export function hasCookieConsent(): boolean {
  return typeof document !== "undefined" && hasCookieConsentValue(document.cookie);
}

/** Persist acceptance and notify listeners (analytics starts only after this). */
export function grantCookieConsent(): void {
  document.cookie = `${CONSENT_PAIR}; path=/; max-age=31536000; samesite=lax`;
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}
