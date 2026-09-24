import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Meter, type MeterTone } from "./Meter";

/** Big serif percentage with a meter underneath; shows `fallback` when value is null. */
export function ScoreCard({
  label,
  value,
  tone,
  caption,
  fallback,
}: {
  label: string;
  value: number | null;
  tone: MeterTone;
  caption?: ReactNode;
  fallback: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 pt-5">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {value === null ? (
          <p className="text-sm text-muted-foreground">{fallback}</p>
        ) : (
          <>
            <p className="font-serif text-5xl font-semibold tabular-nums leading-none tracking-tight">
              {value}
              <span className="text-2xl text-muted-foreground">%</span>
            </p>
            <Meter value={value} tone={tone} label={label} />
          </>
        )}
        {caption && <div className="text-xs text-muted-foreground">{caption}</div>}
      </CardContent>
    </Card>
  );
}
