import { afterEach, describe, expect, it, vi } from "vitest";
import { authErrorMessage, logAuthFailure } from "./authErrors";

const firebaseError = (code: string) =>
  Object.assign(new Error(`Firebase: Error (${code}).`), { code });

afterEach(() => vi.restoreAllMocks());

describe("authErrorMessage", () => {
  it("maps known Firebase codes to friendly copy", () => {
    expect(authErrorMessage(firebaseError("auth/wrong-password"))).toBe(
      "Incorrect password. Try again or reset it."
    );
  });

  it("explains that Google sign-in is unavailable in the native app", () => {
    expect(
      authErrorMessage(firebaseError("auth/operation-not-supported-in-this-environment"))
    ).toBe("Google sign-in isn't available in the app. Use email instead.");
  });

  it("falls back for unknown codes and non-Firebase errors", () => {
    expect(authErrorMessage(firebaseError("auth/something-new"))).toBe(
      "Unable to authenticate. Please try again."
    );
    expect(authErrorMessage(new Error("boom"))).toBe("Something went wrong. Please try again.");
  });
});

describe("logAuthFailure", () => {
  it("logs only the error code at warn level, never via console.error", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    logAuthFailure("signin", firebaseError("auth/wrong-password"));

    expect(error).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith("[auth] signin failed: auth/wrong-password");
    expect(warn.mock.calls[0].every((arg) => typeof arg === "string")).toBe(true);
  });

  it("uses the message for plain errors", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    logAuthFailure("sign-out", new Error("network down"));
    expect(warn).toHaveBeenCalledWith("[auth] sign-out failed: network down");
  });
});
