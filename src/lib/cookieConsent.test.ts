import { describe, expect, it } from "vitest";
import { hasCookieConsentValue } from "./cookieConsent";

describe("hasCookieConsentValue", () => {
  it("accepts only an explicit CookieConsent=true pair", () => {
    expect(hasCookieConsentValue("CookieConsent=true")).toBe(true);
    expect(hasCookieConsentValue("grademeAuthToken=abc; CookieConsent=true")).toBe(true);
  });

  it("rejects a missing, empty, or declined cookie", () => {
    expect(hasCookieConsentValue("")).toBe(false);
    expect(hasCookieConsentValue("CookieConsent=false")).toBe(false);
    expect(hasCookieConsentValue("Other=CookieConsent=true")).toBe(false);
  });
});
