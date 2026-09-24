import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ChevronRight, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Submission } from "@/lib/types/user-history";
import { cn } from "@/lib/utils";
import { formatDateTime, GradeBadge } from "./format";

function Collapsible({
  summary,
  defaultOpen,
  children,
}: {
  summary: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details className="group/d rounded-lg border border-border" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/60 [&::-webkit-details-marker]:hidden">
        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground transition-transform group-open/d:rotate-90"
          aria-hidden
        />
        {summary}
      </summary>
      <div className="border-t border-border px-4 py-4">{children}</div>
    </details>
  );
}

type Props = { summaryID: string; submissions: Submission[] };

export default function SubmissionTimeline({ summaryID, submissions }: Props) {
  const ordered = submissions
    .map((submission, index) => ({ submission, number: index + 1 }))
    .reverse();

  return (
    <ol className="relative flex flex-col gap-6 before:absolute before:bottom-2 before:left-[0.4375rem] before:top-2 before:w-px before:bg-border">
      {ordered.map(({ submission, number }, i) => {
        const isLatest = i === 0;
        return (
          <li key={submission.timestamp?.toMillis?.() ?? number} className="relative pl-8">
            <span
              className={cn(
                "absolute left-0 top-1.5 size-3.5 rounded-full border-2 border-background",
                isLatest ? "bg-primary" : "bg-input"
              )}
              aria-hidden
            />
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium">
                    Submission {number}
                    {isLatest && (
                      <span className="ml-2 text-xs font-normal text-primary">Latest</span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(submission.timestamp)}
                  </p>
                </div>
                <GradeBadge grade={submission.grade} />
                <Button asChild variant="outline" size="sm">
                  <Link href={`/assignments/${summaryID}/${submission.timestamp?.toMillis?.()}`}>
                    <PenLine /> Open in editor
                  </Link>
                </Button>
              </div>

              <Collapsible summary="Feedback" defaultOpen={isLatest}>
                {submission.response ? (
                  <div className="feedback-prose">
                    <ReactMarkdown>{submission.response}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No feedback saved.</p>
                )}
              </Collapsible>

              <Collapsible summary="Submitted text">
                <div
                  className="feedback-prose scrollbar-thin max-h-96 overflow-y-auto font-serif"
                  dangerouslySetInnerHTML={{
                    __html: submission.text || "<p>No text submitted</p>",
                  }}
                />
              </Collapsible>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
