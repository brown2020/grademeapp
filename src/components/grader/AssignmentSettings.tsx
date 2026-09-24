"use client";

import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useRubricStore } from "@/zustand/useRubricStore";
import userInputs from "@/lib/constants/userInputs";
import type { GradingData } from "@/lib/types/grading-data";
import { Field, Input } from "@/components/ui/input";
import { SimpleSelect } from "@/components/ui/select";

const toOptions = (values: string[]) => values.map((v) => ({ label: v, value: v }));

const ASSIGNER_OPTIONS = toOptions(userInputs.assigner.options.student);
const TEXT_TYPE_OPTIONS = toOptions(userInputs.textType.map((t) => t.value));
const AUDIENCE_OPTIONS = toOptions(userInputs.audience.options);
const LIMIT_TYPE_OPTIONS = toOptions(userInputs.wordCount.comparisonType);

function wordLimitPlaceholder(type: GradingData["wordLimitType"]) {
  if (type === "between") return "500-1000";
  if (type === "less than" || type === "more than") return "500";
  return "Enter a number";
}

/** Optional assignment context sent with each grading request. */
export function AssignmentSettings({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const gradingData = useRubricStore((s) => s.gradingData);
  const setGradingData = useRubricStore((s) => s.setGradingData);

  const proseOptions = useMemo(() => {
    const details = gradingData.textType
      ? userInputs.prose.details[gradingData.textType]
      : undefined;
    return toOptions(details?.options ?? userInputs.prose.options);
  }, [gradingData.textType]);

  const summary =
    [gradingData.textType, gradingData.assigner, gradingData.wordLimit && `${gradingData.wordLimit} words`]
      .filter(Boolean)
      .join(" · ") || "Optional context for a sharper grade";

  const update = (patch: Partial<GradingData>) => setGradingData(patch);

  return (
    <details className="group" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg py-1 focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 flex-col">
          <span className="text-sm font-medium">Assignment details</span>
          <span className="truncate text-xs text-muted-foreground">{summary}</span>
        </span>
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
        />
      </summary>

      <div className="mt-4 flex flex-col gap-4">
        <Field label="Topic" htmlFor="grader-topic">
          <Input
            id="grader-topic"
            value={gradingData.topic}
            onChange={(e) => update({ topic: e.target.value })}
            placeholder="e.g. Later school start times"
          />
        </Field>
        <Field label="Assigned by" htmlFor="grader-assigner">
          <SimpleSelect
            id="grader-assigner"
            value={gradingData.assigner}
            options={ASSIGNER_OPTIONS}
            onChange={(assigner) => update({ assigner })}
            placeholder="Select assigner"
          />
        </Field>
        <Field label="Text type" htmlFor="grader-text-type">
          <SimpleSelect
            id="grader-text-type"
            value={gradingData.textType}
            options={TEXT_TYPE_OPTIONS}
            onChange={(textType) => update({ textType })}
            placeholder="Select text type"
          />
        </Field>
        <Field label="Prose" htmlFor="grader-prose">
          <SimpleSelect
            id="grader-prose"
            value={gradingData.prose}
            options={proseOptions}
            onChange={(prose) => update({ prose })}
            placeholder="Select prose"
          />
        </Field>
        <Field label="Audience" htmlFor="grader-audience">
          <SimpleSelect
            id="grader-audience"
            value={gradingData.audience}
            options={AUDIENCE_OPTIONS}
            onChange={(audience) => update({ audience })}
            placeholder="Select audience"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Word limit" htmlFor="grader-word-limit-type">
            <SimpleSelect
              id="grader-word-limit-type"
              value={gradingData.wordLimitType}
              options={LIMIT_TYPE_OPTIONS}
              onChange={(value) =>
                update({ wordLimitType: value as GradingData["wordLimitType"] })
              }
              placeholder="Type"
            />
          </Field>
          <Field label="Words" htmlFor="grader-word-limit">
            <Input
              id="grader-word-limit"
              value={gradingData.wordLimit}
              onChange={(e) => update({ wordLimit: e.target.value })}
              placeholder={wordLimitPlaceholder(gradingData.wordLimitType)}
            />
          </Field>
        </div>
      </div>
    </details>
  );
}
