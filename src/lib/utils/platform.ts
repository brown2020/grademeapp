import { useSyncExternalStore } from "react";

/** True inside the React Native wrapper, which injects `window.ReactNativeWebView`. */
export function isReactNativeWebView(): boolean {
  return typeof window !== "undefined" && typeof window.ReactNativeWebView !== "undefined";
}

const noopSubscribe = () => () => {};

/**
 * Whether the page runs inside the native app. `null` until hydration, so UI the
 * app must not offer (Google sign-in, credit purchases) never renders before the
 * client has checked.
 */
export function useIsReactNativeWebView(): boolean | null {
  return useSyncExternalStore(noopSubscribe, isReactNativeWebView, () => null);
}
