"use client";

import useSWR from "swr";

type Options<T> = {
  /** Poll every `pollMs` while this returns true for the latest data. */
  pollWhile?: (data: T | undefined) => boolean;
  pollMs?: number;
};

/**
 * Fetches JSON from `url` (skipped while null) through SWR, which dedupes
 * requests, ignores stale responses and keeps the last good data on refresh.
 */
export function useJsonResource<T>(
  url: string | null,
  parse: (response: Response) => Promise<T>,
  { pollWhile, pollMs = 0 }: Options<T> = {}
) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<T, unknown, string | null>(
    url,
    (key) => fetch(key, { cache: "no-store" }).then(parse),
    {
      keepPreviousData: true,
      refreshInterval: (latest) => (pollWhile?.(latest) ? pollMs : 0),
    }
  );

  return {
    data,
    error: error ? (error instanceof Error ? error.message : "Something went wrong.") : undefined,
    isLoading,
    isRefreshing: isValidating && data !== undefined,
    reload: () => void mutate(),
  };
}
