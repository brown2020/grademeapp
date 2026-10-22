"use client";

import { lazy, Suspense } from "react";

const ReactMarkdown = lazy(() => import("react-markdown"));

/** Renders markdown, loading the parser on first use and showing plain text until it arrives. */
export function Markdown({ children }: { children: string }) {
  return (
    <Suspense fallback={<p className="whitespace-pre-wrap">{children}</p>}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </Suspense>
  );
}
