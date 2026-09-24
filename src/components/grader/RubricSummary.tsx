import Link from "next/link";
import { LayoutList } from "lucide-react";
import type { RubricState } from "@/lib/types/rubrics-types";

/** The rubric a grade is measured against, with an optional "Change" link. */
export function RubricSummary({
  rubric,
  changeable = true,
}: {
  rubric: RubricState | null | undefined;
  changeable?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <LayoutList className="size-4" aria-hidden />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Rubric
          </span>
          {changeable && (
            <Link
              href="/rubrics"
              className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              {rubric ? "Change" : "Choose"}
            </Link>
          )}
        </div>
        <p className="font-medium leading-snug">{rubric?.name ?? "No rubric selected"}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {rubric
            ? rubric.description || "Criteria from this rubric shape your grade."
            : "Pick a rubric so feedback matches how you'll be graded."}
        </p>
      </div>
    </div>
  );
}

/** Compact rubric strip shown above the editor on small screens. */
export function MobileRubricBar(props: {
  rubric: RubricState | null | undefined;
  changeable?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3 shadow-soft lg:hidden">
      <RubricSummary {...props} />
    </div>
  );
}
