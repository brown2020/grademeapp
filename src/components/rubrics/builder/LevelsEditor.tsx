"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { createLevel, type LevelDraft } from "../lib/rubricDraft";

export default function LevelsEditor({
  levels,
  onChange,
  editableLabels,
  idPrefix,
  addLabel = "Add level",
  placeholder,
  formatLabel = (label) => label,
}: {
  levels: LevelDraft[];
  onChange: (levels: LevelDraft[]) => void;
  editableLabels: boolean;
  idPrefix: string;
  addLabel?: string;
  placeholder?: (label: string) => string;
  formatLabel?: (label: string) => string;
}) {
  const update = (id: string, patch: Partial<LevelDraft>) =>
    onChange(levels.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  return (
    <div className="flex flex-col gap-3">
      {levels.map((level, index) => {
        const textId = `${idPrefix}-${level.id}`;
        return (
          <div key={level.id} className="flex flex-col gap-1.5">
            {editableLabels ? (
              <div className="flex items-center gap-2">
                <Input
                  aria-label={`Level ${index + 1} name`}
                  value={level.label}
                  onChange={(e) => update(level.id, { label: e.target.value })}
                  placeholder="Level name"
                  className="h-8 max-w-56 text-sm font-medium"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove level ${level.label || index + 1}`}
                  onClick={() => onChange(levels.filter((l) => l.id !== level.id))}
                  disabled={levels.length <= 1}
                >
                  <X />
                </Button>
              </div>
            ) : (
              <label htmlFor={textId} className="text-sm font-medium">
                {formatLabel(level.label)}
              </label>
            )}
            <Textarea
              id={textId}
              aria-label={editableLabels ? `${level.label || `Level ${index + 1}`} description` : undefined}
              value={level.text}
              onChange={(e) => update(level.id, { text: e.target.value })}
              placeholder={placeholder?.(level.label) ?? "What does work at this level look like?"}
              className="min-h-16"
              rows={2}
            />
          </div>
        );
      })}
      {editableLabels && (
        <Button
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={() => onChange([...levels, createLevel()])}
        >
          <Plus /> {addLabel}
        </Button>
      )}
    </div>
  );
}
