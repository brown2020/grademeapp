import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Meter } from "./Meter";
import { sourcePercent, type MatchedSource } from "./report";

function hostname(url?: string) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function MatchedSources({
  sources,
  wordCount,
}: {
  sources: MatchedSource[];
  wordCount?: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-lg">Matched sources</CardTitle>
        <CardDescription>
          {sources.length === 0
            ? "No matching sources were found."
            : `${sources.length} source${sources.length === 1 ? "" : "s"} share wording with your text.`}
        </CardDescription>
      </CardHeader>
      {sources.length > 0 && (
        <CardContent>
          <ul className="divide-y divide-border">
            {sources.map((source) => {
              const percent = sourcePercent(source, wordCount);
              const host = hostname(source.url);
              return (
                <li key={source.id} className="flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium leading-snug">{source.title || host || "Untitled source"}</p>
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mt-0.5 inline-flex max-w-full items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
                        >
                          <span className="truncate">{host}</span>
                          <ExternalLink className="size-3 shrink-0" aria-hidden />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      {percent !== null && (
                        <div className="font-serif text-lg font-semibold tabular-nums leading-none">
                          {percent}%
                        </div>
                      )}
                      {typeof source.matchedWords === "number" && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {source.matchedWords.toLocaleString()} words
                        </div>
                      )}
                    </div>
                  </div>
                  {percent !== null && (
                    <Meter value={percent} tone="warning" label={`Matched with ${host ?? "source"}`} className="h-1.5" />
                  )}
                  {source.introduction && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">{source.introduction}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}
