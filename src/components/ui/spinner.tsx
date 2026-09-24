import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({
  className,
  label = "Loading",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span role="status" className="inline-flex items-center">
      <Loader2
        className={cn("size-5 animate-spin text-muted-foreground", className)}
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function PageLoader({ label }: { label?: string }) {
  return (
    <div className="flex h-full min-h-48 flex-1 items-center justify-center">
      <Spinner className="size-6" label={label} />
    </div>
  );
}
