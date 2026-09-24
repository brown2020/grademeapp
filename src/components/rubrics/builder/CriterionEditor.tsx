"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import {
  createSubCriterion,
  type CriterionDraft,
  type SubCriterionDraft,
} from "../lib/rubricDraft";
import type { RubricTypeConfig } from "../lib/rubricTypeConfig";
import LevelsEditor from "./LevelsEditor";

type Props = {
  criterion: CriterionDraft;
  index: number;
  total: number;
  config: RubricTypeConfig;
  onChange: (patch: Partial<CriterionDraft>) => void;
  onMove: (to: number) => void;
  onRemove: () => void;
};

function SubCriteriaEditor({
  criterion,
  config,
  onChange,
}: {
  criterion: CriterionDraft;
  config: RubricTypeConfig;
  onChange: (subCriteria: SubCriterionDraft[]) => void;
}) {
  const subs = criterion.subCriteria;
  const update = (id: string, patch: Partial<SubCriterionDraft>) =>
    onChange(subs.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm font-medium">Sub-criteria</div>
      {subs.map((sub, i) => (
        <div key={sub.id} className="flex flex-col gap-3 rounded-lg border border-border bg-background p-3">
          <div className="flex items-start gap-2">
            <Field label={`Sub-criterion ${i + 1}`} htmlFor={`sub-${sub.id}`} className="flex-1">
              <Input
                id={`sub-${sub.id}`}
                value={sub.description}
                onChange={(e) => update(sub.id, { description: e.target.value })}
                placeholder="e.g. Word choice"
              />
            </Field>
            <Button
              variant="ghost"
              size="icon-sm"
              className="mt-7"
              aria-label={`Remove sub-criterion ${i + 1}`}
              onClick={() => onChange(subs.filter((s) => s.id !== sub.id))}
            >
              <Trash2 />
            </Button>
          </div>
          <LevelsEditor
            idPrefix={`sub-${sub.id}`}
            levels={sub.levels}
            editableLabels={false}
            onChange={(levels) => update(sub.id, { levels })}
          />
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="self-start"
        onClick={() => onChange([...subs, createSubCriterion(config.defaultLevels)])}
      >
        <Plus /> Add sub-criterion
      </Button>
    </div>
  );
}

export default function CriterionEditor({ criterion, index, total, config, onChange, onMove, onRemove }: Props) {
  const noun = config.itemLabel;
  const nameId = `crit-name-${criterion.id}`;
  const descId = `crit-desc-${criterion.id}`;
  const title = criterion.name.trim() || `${noun} ${index + 1}`;
  const isChecklist = criterion.format === "check";

  const controls = (
    <div className="flex shrink-0 items-center">
      <Button variant="ghost" size="icon-sm" aria-label={`Move ${title} up`} disabled={index === 0} onClick={() => onMove(index - 1)}>
        <ArrowUp />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label={`Move ${title} down`} disabled={index === total - 1} onClick={() => onMove(index + 1)}>
        <ArrowDown />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label={`Remove ${title}`} onClick={onRemove}>
        <Trash2 />
      </Button>
    </div>
  );

  if (isChecklist) {
    return (
      <div className="flex items-center gap-2">
        <Input
          aria-label={`Checklist item ${index + 1}`}
          value={criterion.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder={config.namePlaceholder}
          className="flex-1"
        />
        {controls}
      </div>
    );
  }

  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="flex items-start gap-2">
        <Field label={`${noun} ${index + 1}`} htmlFor={nameId} className="flex-1">
          <Input
            id={nameId}
            value={criterion.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder={config.namePlaceholder}
          />
        </Field>
        <div className="mt-7">{controls}</div>
      </div>

      {criterion.format === "raw" ? (
        <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
          This {noun.toLowerCase()} uses an advanced format that can&apos;t be edited here. It will be
          kept as-is when you save; you can rename, reorder or remove it.
        </p>
      ) : (
        <>
          {criterion.hasDescription && (
            <Field label="Description" htmlFor={descId}>
              <Textarea
                id={descId}
                value={criterion.description}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder={config.descriptionPlaceholder}
                className="min-h-16"
                rows={2}
              />
            </Field>
          )}
          {criterion.format === "trait" ? (
            <SubCriteriaEditor
              criterion={criterion}
              config={config}
              onChange={(subCriteria) => onChange({ subCriteria })}
            />
          ) : (
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-muted-foreground">{config.levelsLabel ?? "Performance levels"}</div>
              <LevelsEditor
                idPrefix={`crit-${criterion.id}`}
                levels={criterion.levels}
                editableLabels={config.editableLevels}
                formatLabel={config.numericLevels ? (label) => `Score ${label}` : undefined}
                addLabel={criterion.levelsKey === "stages" ? "Add stage" : "Add level"}
                onChange={(levels) => onChange({ levels })}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}
