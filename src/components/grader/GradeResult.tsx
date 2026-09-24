import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradeBadge } from "./GradeBadge";

/** The grade and markdown feedback for one submission. */
export function GradeResult({
  grade,
  feedback,
  streaming = false,
  rubricName,
  actions,
}: {
  grade: string;
  feedback: string;
  streaming?: boolean;
  rubricName?: string;
  actions?: ReactNode;
}) {
  return (
    <Card id="response" className="scroll-mt-6" aria-busy={streaming}>
      <div className="flex items-center gap-4 p-5 sm:p-6">
        <GradeBadge grade={grade} />
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-serif text-xl font-semibold tracking-tight">Grade.me report</h2>
            {streaming && <Badge variant="primary">Writing feedback…</Badge>}
          </div>
          {rubricName && (
            <p className="truncate text-sm text-muted-foreground">Measured against {rubricName}</p>
          )}
        </div>
      </div>
      <CardContent className="border-t border-border pt-5 sm:px-6">
        <div className="feedback-prose">
          <ReactMarkdown>{feedback}</ReactMarkdown>
        </div>
      </CardContent>
      {actions && !streaming && (
        <CardFooter className="flex-wrap justify-end">{actions}</CardFooter>
      )}
    </Card>
  );
}
