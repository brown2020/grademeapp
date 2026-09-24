"use client";

import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Model, models } from "@/lib/types/models";
import { createModelId } from "@/lib/utils";

const groupedModels = models.reduce<Record<string, Model[]>>((groups, model) => {
  (groups[model.provider] ??= []).push(model);
  return groups;
}, {});

export function ModelSelector({
  id,
  selectedModelId,
  onModelChange,
}: {
  id?: string;
  selectedModelId: string;
  onModelChange: (id: string) => void;
}) {
  return (
    <Select name="model" value={selectedModelId} onValueChange={onModelChange}>
      <SelectTrigger id={id} aria-label="Model">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {Object.entries(groupedModels).map(([provider, providerModels]) => (
          <SelectGroup key={provider}>
            <SelectLabel className="sticky top-0 z-10 bg-surface">{provider}</SelectLabel>
            {providerModels.map((model) => (
              <SelectItem key={createModelId(model)} value={createModelId(model)}>
                <span className="flex items-center gap-2">
                  <Image
                    src={`/providers/logos/${model.providerId}.svg`}
                    alt=""
                    width={16}
                    height={16}
                    className="size-4 rounded-full"
                  />
                  {model.name}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
