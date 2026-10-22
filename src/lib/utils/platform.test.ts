import { afterEach, describe, expect, it, vi } from "vitest";
import { isReactNativeWebView } from "./platform";

afterEach(() => vi.unstubAllGlobals());

describe("isReactNativeWebView", () => {
  it("is false on the server and in a regular browser", () => {
    expect(isReactNativeWebView()).toBe(false);
    vi.stubGlobal("window", {});
    expect(isReactNativeWebView()).toBe(false);
  });

  it("is true when the native wrapper injects ReactNativeWebView", () => {
    vi.stubGlobal("window", { ReactNativeWebView: { postMessage: () => {} } });
    expect(isReactNativeWebView()).toBe(true);
  });
});
