"use client";

import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import type { RubricState } from "@/lib/types/rubrics-types";
import type { ProfileType } from "@/zustand/useProfileStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/input";
import { AssignmentSettings } from "./AssignmentSettings";
import { CreditHint } from "./CreditHint";
import { ModelSelector } from "./ModelSelector";
import { RubricSummary } from "./RubricSummary";

/**
 * Side panel for grading: rubric, model, assignment details and the primary
 * submit button. Must render inside the grading <form>.
 */
export function GradingPanel({
  rubric,
  rubricChangeable = true,
  modelId,
  onModelChange,
  profile,
  canSubmit,
  thinking,
  submitLabel = "Grade my writing",
  children,
}: {
  rubric: RubricState | null | undefined;
  rubricChangeable?: boolean;
  modelId: string;
  onModelChange: (id: string) => void;
  profile: ProfileType;
  canSubmit: boolean;
  thinking: boolean;
  submitLabel?: string;
  /** Secondary tools rendered under the submit button. */
  children?: ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-5 p-5">
      {/* On small screens the rubric is shown above the editor instead. */}
      <div className="hidden flex-col gap-5 lg:flex">
        <RubricSummary rubric={rubric} changeable={rubricChangeable} />
        <div className="h-px bg-border" />
      </div>
      <Field label="Model" htmlFor="grader-model">
        <ModelSelector id="grader-model" selectedModelId={modelId} onModelChange={onModelChange} />
      </Field>
      <AssignmentSettings />
      <div className="flex flex-col gap-2.5">
        <Button
          id="grademe"
          type="submit"
          size="lg"
          className="w-full"
          loading={thinking}
          disabled={!canSubmit}
        >
          {!thinking && <Sparkles />}
          {thinking ? "Grading…" : submitLabel}
        </Button>
        <CreditHint profile={profile} />
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
          {children}
        </div>
      )}
    </Card>
  );
}
