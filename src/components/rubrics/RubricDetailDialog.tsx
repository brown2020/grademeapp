"use client";

import { Copy, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RubricState } from "@/lib/types/rubrics-types";
import RubricDisplay from "./RubricDisplay";
import type { RubricCardActions } from "./RubricCard";
import { getRubricTypeConfig } from "./lib/rubricTypeConfig";

export default function RubricDetailDialog({
  rubric,
  onOpenChange,
  actions,
}: {
  rubric: RubricState | null;
  onOpenChange: (open: boolean) => void;
  actions: Pick<RubricCardActions, "onUse" | "onEdit" | "onDuplicate">;
}) {
  const config = rubric ? getRubricTypeConfig(rubric.type) : null;
  const tags = rubric
    ? [rubric.identity, rubric.identityLevel, rubric.textType?.trim(), rubric.proseType].filter(Boolean)
    : [];

  return (
    <Dialog open={rubric !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        {rubric && config && (
          <>
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="primary">{config.label}</Badge>
                {rubric.isCustom && <Badge variant="outline">Mine</Badge>}
                {tags.map((tag) => (
                  <Badge key={tag} variant="neutral" className="capitalize">{tag}</Badge>
                ))}
              </div>
              <DialogTitle className="text-2xl">{rubric.name}</DialogTitle>
              <DialogDescription>{rubric.description || config.explanation}</DialogDescription>
            </DialogHeader>

            <RubricDisplay rubric={rubric} />

            <DialogFooter>
              {rubric.isCustom ? (
                <Button variant="secondary" onClick={() => actions.onEdit(rubric)}>
                  <Pencil /> Edit
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => actions.onDuplicate(rubric)}>
                  <Copy /> Copy to my rubrics
                </Button>
              )}
              <Button onClick={() => actions.onUse(rubric)}>Use this rubric</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
