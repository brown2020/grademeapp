import { Skeleton } from "@/components/ui/spinner";

export default function HistorySkeleton() {
  return (
    <ul className="flex flex-col gap-3 md:gap-0" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <li
          key={i}
          className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 md:rounded-none md:border-0 md:border-b md:bg-transparent"
        >
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-2/3 max-w-xs" />
            <Skeleton className="h-3 w-1/3 max-w-40" />
          </div>
          <Skeleton className="hidden h-3 w-20 md:block" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </li>
      ))}
    </ul>
  );
}
