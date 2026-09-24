import { Timestamp } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Tone = "success" | "primary" | "warning" | "danger" | "neutral";

export function gradeTone(grade?: string | null): Tone {
  const value = Number.parseFloat(grade ?? "");
  if (Number.isNaN(value)) return "neutral";
  if (value >= 90) return "success";
  if (value >= 75) return "primary";
  if (value >= 60) return "warning";
  return "danger";
}

export function GradeBadge({
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

/** Firestore timestamps written by older clients may be plain dates. */
export function toDate(value: Timestamp | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();
  return null;
}

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDate(value: Timestamp | Date | null | undefined) {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : "—";
}

export function formatDateTime(value: Timestamp | Date | null | undefined) {
  const date = toDate(value);
  return date ? dateTimeFormatter.format(date) : "—";
}
