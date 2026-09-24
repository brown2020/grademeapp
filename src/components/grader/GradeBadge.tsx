import { cn } from "@/lib/utils";

function gradeTone(grade: string) {
  const value = Number.parseInt(grade, 10);
  if (Number.isNaN(value)) return "bg-muted text-muted-foreground";
  if (value >= 80) return "bg-success-soft text-success";
  if (value >= 60) return "bg-warning-soft text-foreground";
  return "bg-danger-soft text-destructive";
}

/** Large serif grade tile, e.g. "85%". Shows an em dash until a grade is known. */
export function GradeBadge({
  grade,
  size = "lg",
  className,
}: {
  grade: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const known = !!grade && grade !== "N/A";
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col items-center justify-center rounded-xl",
        size === "lg" ? "size-16 sm:size-20" : "size-14",
        gradeTone(known ? grade : ""),
        className
      )}
    >
      <span
        className={cn(
          "font-serif font-semibold leading-none",
          size === "lg" ? "text-2xl sm:text-3xl" : "text-xl"
        )}
      >
        {known ? grade : "—"}
      </span>
      <span className="mt-1 text-[0.625rem] font-medium uppercase tracking-wider opacity-80">
        Grade
      </span>
    </div>
  );
}
