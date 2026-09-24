import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton, Spinner } from "@/components/ui/spinner";

/** Placeholder shown while waiting for the first streamed feedback. */
export function GradingPending({ label = "Grading your writing…" }: { label?: string }) {
  return (
    <Card id="thinking" className="scroll-mt-6 p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <Spinner className="size-5 text-primary" label={label} />
        <p className="font-medium">{label}</p>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Reading against your rubric. This usually takes 10–30 seconds.
      </p>
      <div className="mt-5 flex flex-col gap-2.5" aria-hidden>
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
        <Skeleton className="h-3.5 w-3/4" />
      </div>
    </Card>
  );
}

export function GradingError({ message }: { message: string }) {
  return (
    <div
      id="flagged"
      role="alert"
      className="flex scroll-mt-6 items-start gap-3 rounded-xl border border-border bg-danger-soft p-4 text-sm text-destructive"
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>{message}</p>
    </div>
  );
}
