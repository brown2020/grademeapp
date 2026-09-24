"use client";

import { Label } from "@/components/ui/input";

/** Borderless serif title field that sits above the editor. */
export function TitleInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (title: string) => void;
}) {
  return (
    <div>
      <Label htmlFor="grader-title" className="sr-only">
        Title
      </Label>
      <input
        id="grader-title"
        name="title"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Untitled draft"
        autoComplete="off"
        className="w-full rounded-lg bg-transparent px-1 py-1 font-serif text-2xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/60 focus-visible:bg-surface focus-visible:outline-2 focus-visible:outline-ring/30 md:text-3xl"
      />
    </div>
  );
}
