import { Badge } from "@/components/ui/badge";
import { gradeTone } from "@/lib/utils/grade";
import { cn } from "@/lib/utils";

/** Compact grade pill for lists and timelines. */
export function GradePill({
  grade,
  className,
}: {
  grade?: string | null;
  className?: string;
}) {
  const label = grade && grade.trim() ? grade : "N/A";
  return (
    <Badge
      variant={gradeTone(grade)}
      className={cn("px-2.5 py-1 font-serif text-sm font-semibold tabular-nums", className)}
      aria-label={`Grade ${label}`}
    >
      {label}
    </Badge>
  );
}
