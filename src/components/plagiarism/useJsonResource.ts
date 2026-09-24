"use client";

import { useCallback, useEffect, useState } from "react";

type Snapshot<T> = { url: string; key: string; data?: T; error?: string };

/**
 * Fetches `url` (skipped while null) and re-fetches on `reload()`. Loading
 * state is derived, so no setState runs synchronously inside the effect.
 */
export function useJsonResource<T>(
  url: string | null,
  parse: (response: Response) => Promise<T>
) {
  const [nonce, setNonce] = useState(0);
  const [snapshot, setSnapshot] = useState<Snapshot<T> | null>(null);
  const key = url ? `${url}#${nonce}` : "";

  useEffect(() => {
    if (!url) return;
    let active = true;
    fetch(url, { cache: "no-store" })
      .then(parse)
      .then((data) => {
        if (active) setSnapshot({ url, key, data });
      })
      .catch((err: unknown) => {
        if (!active) return;
        const error = err instanceof Error ? err.message : "Something went wrong.";
        setSnapshot((prev) => ({
          url,
          key,
          data: prev?.url === url ? prev.data : undefined,
          error,
        }));
      });
    return () => {
      active = false;
    };
  }, [url, key, parse]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  const current = snapshot && snapshot.url === url ? snapshot : null;
  const settled = current?.key === key;

  return {
    data: current?.data,
    error: settled ? current?.error : undefined,
    isLoading: Boolean(url) && !current?.data && !settled,
    isRefreshing: Boolean(current?.data) && !settled,
    reload,
  };
}

/** Calls `callback` every `ms` while `enabled`. */
export function usePolling(enabled: boolean, ms: number, callback: () => void) {
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(callback, ms);
    return () => window.clearInterval(id);
  }, [enabled, ms, callback]);
}
