"use client";

import { CheckCircle2 } from "lucide-react";
import type { RubricType } from "@/lib/types/rubrics-types";
import { cn } from "@/lib/utils";
import { RUBRIC_TYPES, RUBRIC_TYPE_CONFIG } from "../lib/rubricTypeConfig";

export default function TypeStep({
  value,
  onChange,
}: {
  value: RubricType;
  onChange: (type: RubricType) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Rubric type" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {RUBRIC_TYPES.map((type) => {
        const config = RUBRIC_TYPE_CONFIG[type];
        const selected = type === value;
        return (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(type)}
            className={cn(
              "flex flex-col gap-1.5 rounded-xl border bg-surface p-4 text-left shadow-soft transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              selected ? "border-primary ring-1 ring-primary" : "border-border"
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="font-serif text-base font-semibold">{config.label}</span>
              {selected && <CheckCircle2 className="size-4 text-primary" aria-hidden />}
            </span>
            <span className="text-sm text-muted-foreground">{config.explanation}</span>
          </button>
        );
      })}
    </div>
  );
}
