import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { getDefaultModelId, resolveModelId } from "@/lib/utils";
import { models } from "@/lib/types/models";

/**
 * The grading model the user last picked, persisted in localStorage. A saved id
 * for a model that is no longer offered falls back to the default.
 */
export function useSelectedModel() {
  const [stored, setStored] = useLocalStorage<string>("selectedModel", getDefaultModelId(models));
  return [resolveModelId(stored, models), setStored] as const;
}
