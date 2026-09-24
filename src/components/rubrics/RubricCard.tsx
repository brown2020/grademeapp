"use client";

import { CheckCircle2, Copy, MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RubricState } from "@/lib/types/rubrics-types";
import { cn } from "@/lib/utils";
import { rubricTypeLabel } from "./lib/rubricTypeConfig";

export interface RubricCardActions {
  onUse: (rubric: RubricState) => void;
  onPreview: (rubric: RubricState) => void;
  onToggleFavorite: (rubric: RubricState) => void;
  onEdit: (rubric: RubricState) => void;
  onDelete: (rubric: RubricState) => void;
  onDuplicate: (rubric: RubricState) => void;
}

export default function RubricCard({
  rubric,
  isFavorite,
  isSelected,
  actions,
}: {
  rubric: RubricState;
  isFavorite: boolean;
  isSelected: boolean;
  actions: RubricCardActions;
}) {
  const meta = [rubric.identityLevel, rubric.textType?.trim()].filter(Boolean).join(" · ");

  return (
    <Card
      className={cn(
        "flex h-full flex-col transition-shadow hover:shadow-raised",
        isSelected && "border-primary ring-1 ring-primary"
      )}
    >
      <div className="flex items-start gap-2 p-4 pb-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          <Badge variant="primary">{rubricTypeLabel(rubric.type)}</Badge>
          {rubric.isCustom && <Badge variant="outline">Mine</Badge>}
          {isSelected && (
            <Badge variant="success">
              <CheckCircle2 aria-hidden />
              In use
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={isFavorite ? `Remove ${rubric.name} from favorites` : `Add ${rubric.name} to favorites`}
          aria-pressed={isFavorite}
          onClick={() => actions.onToggleFavorite(rubric)}
          className="-mr-1 -mt-1"
        >
          <Star className={cn(isFavorite ? "fill-primary text-primary" : "text-muted-foreground")} />
        </Button>
      </div>

      <button
        type="button"
        onClick={() => actions.onPreview(rubric)}
        className="flex flex-1 flex-col gap-1.5 px-4 pb-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <h3 className="font-serif text-lg font-semibold leading-snug">{rubric.name}</h3>
        {meta && <p className="text-xs capitalize text-muted-foreground">{meta}</p>}
        {rubric.description && (
          <p className="line-clamp-3 text-sm text-muted-foreground">{rubric.description}</p>
        )}
      </button>

      <div className="mt-auto flex items-center gap-2 border-t border-border px-4 py-3">
        <Button size="sm" onClick={() => actions.onUse(rubric)} className="flex-1 sm:flex-none">
          Use this rubric
        </Button>
        <Button size="sm" variant="ghost" onClick={() => actions.onPreview(rubric)}>
          Preview
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon-sm" variant="ghost" aria-label={`More actions for ${rubric.name}`} className="ml-auto">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {rubric.isCustom ? (
              <>
                <DropdownMenuItem onSelect={() => actions.onEdit(rubric)}>
                  <Pencil /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => actions.onDuplicate(rubric)}>
                  <Copy /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => actions.onDelete(rubric)}>
                  <Trash2 /> Delete
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onSelect={() => actions.onDuplicate(rubric)}>
                <Copy /> Copy to my rubrics
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
