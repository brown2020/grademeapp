"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page";
import { getInitialRubricState } from "@/lib/types/initialRubricStates";
import { RubricType, type RubricState } from "@/lib/types/rubrics-types";
import { cn } from "@/lib/utils";
import { useRubricStore } from "@/zustand/useRubricStore";
import RubricDisplay from "../RubricDisplay";
import { applyDraft, createDraft, draftFromRubric, validateDraft, type RubricDraft } from "../lib/rubricDraft";
import { getRubricTypeConfig } from "../lib/rubricTypeConfig";
import CriteriaEditor from "./CriteriaEditor";
import TypeStep from "./TypeStep";

type Step = 0 | 1 | 2;
const STEPS = ["Type", "Details", "Criteria"] as const;

function Stepper({ step, firstStep }: { step: Step; firstStep: Step }) {
  return (
    <ol className="mb-6 flex items-center gap-2 text-sm" aria-label="Progress">
      {STEPS.map((label, i) => {
        if (i < firstStep) return null;
        const state = i < step ? "done" : i === step ? "current" : "todo";
        return (
          <li key={label} className="flex items-center gap-2" aria-current={state === "current" ? "step" : undefined}>
            {i > firstStep && <span className="h-px w-6 bg-border" aria-hidden />}
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-xs font-medium",
                state === "todo" ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
              )}
            >
              {i - firstStep + 1}
            </span>
            <span className={cn(state === "current" ? "font-medium" : "text-muted-foreground")}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default function RubricBuilder({
  rubric,
  onClose,
  onSaved,
}: {
  /** Existing custom rubric to edit; omit to create a new one. */
  rubric?: RubricState;
  onClose: () => void;
  onSaved?: (rubric: RubricState) => void;
}) {
  const addCustomRubric = useRubricStore((s) => s.addCustomRubric);
  const updateCustomRubric = useRubricStore((s) => s.updateCustomRubric);

  const isEditing = Boolean(rubric?.id);
  const firstStep: Step = isEditing ? 1 : 0;
  const [step, setStep] = useState<Step>(firstStep);
  const [name, setName] = useState(rubric?.name ?? "");
  const [description, setDescription] = useState(rubric?.description ?? "");
  const [draft, setDraft] = useState<RubricDraft>(() =>
    rubric ? draftFromRubric(rubric) : createDraft(RubricType.Analytical)
  );
  const [saving, setSaving] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const config = getRubricTypeConfig(draft.type);
  const base = useMemo(() => rubric ?? getInitialRubricState(draft.type), [rubric, draft.type]);
  const preview = useMemo(
    () => applyDraft(base, draft, { name, description }),
    [base, draft, name, description]
  );
  const errors = useMemo(() => validateDraft(draft), [draft]);
  const detailsValid = name.trim() !== "" && description.trim() !== "";

  const chooseType = (type: RubricType) => {
    if (type !== draft.type) setDraft(createDraft(type));
  };

  const next = () => {
    if (step === 1 && !detailsValid) {
      setShowErrors(true);
      toast.error("Please provide a name and description for the rubric.");
      return;
    }
    setShowErrors(false);
    setStep((s) => Math.min(2, s + 1) as Step);
  };

  const save = async () => {
    if (!detailsValid) {
      setStep(1);
      setShowErrors(true);
      toast.error("Please provide a name and description for the rubric.");
      return;
    }
    if (errors.length > 0) {
      setShowErrors(true);
      toast.error(errors[0]);
      return;
    }
    setSaving(true);
    try {
      if (isEditing && rubric) {
        await updateCustomRubric(rubric.id, {
          name: preview.name,
          description: preview.description,
          criteria: preview.criteria,
          feedback: "feedback" in preview ? preview.feedback : undefined,
        });
        toast.success("Rubric updated");
        onSaved?.(preview);
      } else {
        const saved = await addCustomRubric(preview);
        toast.success("Rubric created");
        onSaved?.(saved);
      }
      onClose();
    } catch {
      toast.error("Couldn't save the rubric. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow={isEditing ? "Edit rubric" : "New rubric"}
        title={isEditing ? rubric?.name || "Edit rubric" : "Build a rubric"}
        description="Custom rubrics are saved to My rubrics and can be used by the grader like any other."
        actions={
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft /> Back to rubrics
          </Button>
        }
      />

      <Stepper step={step} firstStep={firstStep} />

      {step === 0 && (
        <section aria-label="Choose a rubric type" className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">What kind of rubric do you want to build?</p>
          <TypeStep value={draft.type} onChange={chooseType} />
        </section>
      )}

      {step === 1 && (
        <Card className="max-w-2xl">
          <CardContent className="flex flex-col gap-4 pt-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Type <Badge variant="primary">{config.label}</Badge>
            </div>
            <Field label="Name" htmlFor="rubric-name">
              <Input
                id="rubric-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 9th grade persuasive essay"
                aria-invalid={showErrors && !name.trim()}
                autoFocus
              />
            </Field>
            <Field label="Description" htmlFor="rubric-description" hint="Shown on the rubric card and sent to the grader.">
              <Textarea
                id="rubric-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What assignment is this rubric for, and what does it focus on?"
                aria-invalid={showErrors && !description.trim()}
                rows={3}
              />
            </Field>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
          <section aria-label="Criteria" className="flex min-w-0 flex-col gap-4">
            <CriteriaEditor draft={draft} onChange={setDraft} />
            {showErrors && errors.length > 0 && (
              <div role="alert" className="rounded-lg bg-danger-soft px-4 py-3 text-sm text-destructive">
                <ul className="list-disc pl-4">
                  {errors.map((e, i) => (
                    <li key={`${i}-${e}`}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
          <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Eye className="size-3.5" aria-hidden /> Preview
                </div>
                <CardTitle className="font-serif text-lg">{name || "Untitled rubric"}</CardTitle>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </CardHeader>
              <CardContent className="scrollbar-thin lg:max-h-[70vh] lg:overflow-y-auto">
                <RubricDisplay rubric={preview} />
              </CardContent>
            </Card>
          </aside>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between gap-2 border-t border-border pt-4">
        {step > firstStep ? (
          <Button variant="ghost" onClick={() => setStep((s) => (s - 1) as Step)}>
            <ArrowLeft /> Back
          </Button>
        ) : (
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        )}
        {step < 2 ? (
          <Button onClick={next}>
            Continue <ArrowRight />
          </Button>
        ) : (
          <Button onClick={save} loading={saving}>
            {isEditing ? "Save changes" : "Save rubric"}
          </Button>
        )}
      </div>
    </div>
  );
}
