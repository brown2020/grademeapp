"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-layout";
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

const DETAILS_REQUIRED = "Please provide a name and description for the rubric.";

function DetailsStep({
  typeLabel,
  name,
  description,
  showErrors,
  onNameChange,
  onDescriptionChange,
}: {
  typeLabel: string;
  name: string;
  description: string;
  showErrors: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}) {
  return (
    <Card className="max-w-2xl">
      <CardContent className="flex flex-col gap-4 pt-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Type <Badge variant="primary">{typeLabel}</Badge>
        </div>
        <Field label="Name" htmlFor="rubric-name">
          <Input
            id="rubric-name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. 9th grade persuasive essay"
            aria-invalid={showErrors && !name.trim()}
          />
        </Field>
        <Field label="Description" htmlFor="rubric-description" hint="Shown on the rubric card and sent to the grader.">
          <Textarea
            id="rubric-description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="What assignment is this rubric for, and what does it focus on?"
            aria-invalid={showErrors && !description.trim()}
            rows={3}
          />
        </Field>
      </CardContent>
    </Card>
  );
}

function CriteriaStep({
  draft,
  onDraftChange,
  errors,
  name,
  description,
  preview,
}: {
  draft: RubricDraft;
  onDraftChange: (draft: RubricDraft) => void;
  errors: string[];
  name: string;
  description: string;
  preview: RubricState;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
      <section aria-label="Criteria" className="flex min-w-0 flex-col gap-4">
        <CriteriaEditor draft={draft} onChange={onDraftChange} />
        {errors.length > 0 && (
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
  );
}

function BuilderFooter({
  canGoBack,
  isLastStep,
  isEditing,
  saving,
  onBack,
  onCancel,
  onNext,
  onSave,
}: {
  canGoBack: boolean;
  isLastStep: boolean;
  isEditing: boolean;
  saving: boolean;
  onBack: () => void;
  onCancel: () => void;
  onNext: () => void;
  onSave: () => void;
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-2 border-t border-border pt-4">
      {canGoBack ? (
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft /> Back
        </Button>
      ) : (
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      )}
      {isLastStep ? (
        <Button onClick={onSave} loading={saving}>
          {isEditing ? "Save changes" : "Save rubric"}
        </Button>
      ) : (
        <Button onClick={onNext}>
          Continue <ArrowRight />
        </Button>
      )}
    </div>
  );
}

/** Persists a new or edited custom rubric and reports the outcome. */
function useSaveRubric(rubric: RubricState | undefined, onSaved?: (rubric: RubricState) => void) {
  const addCustomRubric = useRubricStore((s) => s.addCustomRubric);
  const updateCustomRubric = useRubricStore((s) => s.updateCustomRubric);
  const [saving, setSaving] = useState(false);

  const persist = async (preview: RubricState) => {
    if (rubric?.id) {
      await updateCustomRubric(rubric.id, {
        name: preview.name,
        description: preview.description,
        criteria: preview.criteria,
        feedback: "feedback" in preview ? preview.feedback : undefined,
      });
      toast.success("Rubric updated");
      return preview;
    }
    const saved = await addCustomRubric(preview);
    toast.success("Rubric created");
    return saved;
  };

  const save = async (preview: RubricState) => {
    setSaving(true);
    try {
      onSaved?.(await persist(preview));
      return true;
    } catch {
      toast.error("Couldn't save the rubric. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saving, save };
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
  const isEditing = Boolean(rubric?.id);
  const firstStep: Step = isEditing ? 1 : 0;
  const [step, setStep] = useState<Step>(firstStep);
  const [name, setName] = useState(rubric?.name ?? "");
  const [description, setDescription] = useState(rubric?.description ?? "");
  const [draft, setDraft] = useState<RubricDraft>(() =>
    rubric ? draftFromRubric(rubric) : createDraft(RubricType.Analytical)
  );
  const [showErrors, setShowErrors] = useState(false);
  const { saving, save } = useSaveRubric(rubric, onSaved);

  const base = useMemo(() => rubric ?? getInitialRubricState(draft.type), [rubric, draft.type]);
  const preview = useMemo(
    () => applyDraft(base, draft, { name, description }),
    [base, draft, name, description]
  );
  const errors = useMemo(() => validateDraft(draft), [draft]);
  const detailsValid = name.trim() !== "" && description.trim() !== "";

  const rejectDetails = () => {
    setShowErrors(true);
    toast.error(DETAILS_REQUIRED);
  };

  const next = () => {
    if (step === 1 && !detailsValid) return rejectDetails();
    setShowErrors(false);
    setStep((s) => Math.min(2, s + 1) as Step);
  };

  const handleSave = async () => {
    if (!detailsValid) {
      setStep(1);
      return rejectDetails();
    }
    if (errors.length > 0) {
      setShowErrors(true);
      toast.error(errors[0]);
      return;
    }
    if (await save(preview)) onClose();
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
          <TypeStep
            value={draft.type}
            onChange={(type) => type !== draft.type && setDraft(createDraft(type))}
          />
        </section>
      )}

      {step === 1 && (
        <DetailsStep
          typeLabel={getRubricTypeConfig(draft.type).label}
          name={name}
          description={description}
          showErrors={showErrors}
          onNameChange={setName}
          onDescriptionChange={setDescription}
        />
      )}

      {step === 2 && (
        <CriteriaStep
          draft={draft}
          onDraftChange={setDraft}
          errors={showErrors ? errors : []}
          name={name}
          description={description}
          preview={preview}
        />
      )}

      <BuilderFooter
        canGoBack={step > firstStep}
        isLastStep={step === 2}
        isEditing={isEditing}
        saving={saving}
        onBack={() => setStep((s) => (s - 1) as Step)}
        onCancel={onClose}
        onNext={next}
        onSave={handleSave}
      />
    </div>
  );
}
