import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { excerpt, formatDate, similarityPercent, type PlagiarismReportDoc } from "./report";

export function ReportListItem({ uid, report }: { uid: string; report: PlagiarismReportDoc }) {
  const date = formatDate(report.createdAt);
  const similarity = report.status === "completed" ? similarityPercent(report) : null;

  return (
    <li>
      <Link
        href={`/plagiarism-check/${uid}/${report.docId}`}
        className="group flex items-center gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-[0.95rem] font-medium">{excerpt(report.text)}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <StatusBadge status={report.status} />
            {date && <span>{date}</span>}
            {typeof report.wordCount === "number" && (
              <span>{report.wordCount.toLocaleString()} words</span>
            )}
          </div>
        </div>
        {similarity !== null && (
          <div className="shrink-0 text-right">
            <div className="font-serif text-xl font-semibold tabular-nums leading-none">
              {similarity}%
            </div>
            <div className="mt-1 text-xs text-muted-foreground">similarity</div>
          </div>
        )}
        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
    </li>
  );
}
