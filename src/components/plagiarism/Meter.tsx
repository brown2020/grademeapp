import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  primary: "bg-primary",
} as const;

export type MeterTone = keyof typeof TONE_CLASSES;

/** Simple horizontal bar for a 0–100 value. */
export function Meter({
  value,
  tone = "primary",
  label,
  className,
}: {
  value: number;
  tone?: MeterTone;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <div
        className={cn("h-full rounded-full transition-[width]", TONE_CLASSES[tone])}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
