import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserHistoryType } from "@/lib/types/user-history";
import { formatDate, GradeBadge } from "./format";

export const HISTORY_GRID =
  "md:grid md:grid-cols-[minmax(0,1fr)_8rem_7rem_5rem_2.5rem] md:items-center md:gap-4";

type Props = {
  summary: UserHistoryType;
  onDelete: (summary: UserHistoryType) => void;
};

export default function HistoryRow({ summary, onDelete }: Props) {
  const title = summary.userInput?.title?.trim() || "Untitled";
  const rubricName = summary.userInput?.rubric?.name;
  const latest = summary.submissions[summary.submissions.length - 1];
  const count = summary.submissions.length;

  return (
    <li
      className={`group relative flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-soft transition-colors hover:bg-muted/50 focus-within:bg-muted/50 md:rounded-none md:border-0 md:border-b md:bg-transparent md:px-4 md:py-3 md:shadow-none md:last:border-b-0 ${HISTORY_GRID}`}
    >
      <div className="min-w-0 flex-1">
        <Link
          href={`/assignments/${summary.id}`}
          className="block truncate font-medium text-foreground outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:underline md:after:rounded-none"
        >
          {title}
        </Link>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {rubricName || "No rubric"}
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground md:hidden">
          {formatDate(summary.timestamp)} · {count} {count === 1 ? "submission" : "submissions"}
        </p>
      </div>
      <div className="hidden text-sm text-muted-foreground md:block">
        {formatDate(summary.timestamp)}
      </div>
      <div className="hidden text-sm tabular-nums text-muted-foreground md:block">
        {count} {count === 1 ? "submission" : "submissions"}
      </div>
      <div className="shrink-0">
        <GradeBadge grade={latest?.grade} />
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        className="relative z-10 -mr-1 shrink-0 text-muted-foreground hover:text-destructive"
        aria-label={`Delete ${title}`}
        onClick={() => onDelete(summary)}
      >
        <Trash2 />
      </Button>
    </li>
  );
}
