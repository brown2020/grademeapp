"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/input";
import {
  createCriterion,
  moveItem,
  type CriterionDraft,
  type RubricDraft,
} from "../lib/rubricDraft";
import { getRubricTypeConfig } from "../lib/rubricTypeConfig";
import CriterionEditor from "./CriterionEditor";
import LevelsEditor from "./LevelsEditor";

/** Schema-driven editor for every rubric type's criteria. */
export default function CriteriaEditor({
  draft,
  onChange,
}: {
  draft: RubricDraft;
  onChange: (draft: RubricDraft) => void;
}) {
  const config = getRubricTypeConfig(draft.type);

  if (config.shape === "overall") {
    return (
      <div className="flex flex-col gap-3">
        {config.helpText && <p className="text-sm text-muted-foreground">{config.helpText}</p>}
        <LevelsEditor
          idPrefix="overall"
          levels={draft.overall}
          editableLabels={config.editableLevels}
          onChange={(overall) => onChange({ ...draft, overall })}
        />
      </div>
    );
  }

  if (config.shape === "single-point") {
    const feedback = draft.feedback ?? { strengths: "", improvements: "" };
    return (
      <div className="flex flex-col gap-4">
        <LevelsEditor
          idPrefix="single-point"
          levels={draft.overall}
          editableLabels={false}
          placeholder={() => "Describe what proficient work looks like."}
          onChange={(overall) => onChange({ ...draft, overall })}
        />
        <Field label="Strengths" htmlFor="sp-strengths" hint="Optional prompt for noting where the work exceeds proficiency.">
          <Textarea
            id="sp-strengths"
            rows={2}
            className="min-h-16"
            value={feedback.strengths}
            onChange={(e) => onChange({ ...draft, feedback: { ...feedback, strengths: e.target.value } })}
          />
        </Field>
        <Field label="Areas for improvement" htmlFor="sp-improvements" hint="Optional prompt for noting where the work falls short.">
          <Textarea
            id="sp-improvements"
            rows={2}
            className="min-h-16"
            value={feedback.improvements}
            onChange={(e) => onChange({ ...draft, feedback: { ...feedback, improvements: e.target.value } })}
          />
        </Field>
      </div>
    );
  }

  const setCriteria = (criteria: CriterionDraft[]) => onChange({ ...draft, criteria });
  const update = (id: string, patch: Partial<CriterionDraft>) =>
    setCriteria(draft.criteria.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  return (
    <div className="flex flex-col gap-4">
      {config.helpText && <p className="text-sm text-muted-foreground">{config.helpText}</p>}
      <div className={config.shape === "checklist" ? "flex flex-col gap-2" : "flex flex-col gap-4"}>
        {draft.criteria.map((criterion, index) => (
          <CriterionEditor
            key={criterion.id}
            criterion={criterion}
            index={index}
            total={draft.criteria.length}
            config={config}
            onChange={(patch) => update(criterion.id, patch)}
            onMove={(to) => setCriteria(moveItem(draft.criteria, index, to))}
            onRemove={() => setCriteria(draft.criteria.filter((c) => c.id !== criterion.id))}
          />
        ))}
      </div>
      <Button
        variant="secondary"
        className="self-start"
        onClick={() => setCriteria([...draft.criteria, createCriterion(config)])}
      >
        <Plus /> Add {config.itemLabel.toLowerCase()}
      </Button>
    </div>
  );
}
