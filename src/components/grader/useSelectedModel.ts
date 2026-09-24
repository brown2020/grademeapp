import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { getDefaultModelId } from "@/lib/utils";
import { models } from "@/lib/types/models";

/** The grading model the user last picked, persisted in localStorage. */
export function useSelectedModel() {
  return useLocalStorage<string>("selectedModel", getDefaultModelId(models));
}
