import { resolveModelId } from "@/lib/utils";
import type { Model } from "@/lib/types/models";

const BYO_PROVIDERS = new Set(["openai", "fireworks"]);

export interface ModelAccess {
  modelId: string;
  /** Present only when the call is billed to the user's own OpenAI or Fireworks key. */
  apiKey?: string;
  billCredits: boolean;
}

/**
 * Platform keys are used only for credit-billed, allowlisted models.
 * `useCredits: false` selects a user key for OpenAI or Fireworks; every other
 * request falls back to the allowlist and is charged credits.
 */
export function resolveModelAccess(input: {
  requestedModelId: string;
  useCredits: boolean;
  openaiApiKey: string;
  fireworksApiKey: string;
  models: Model[];
}): ModelAccess {
  const provider = input.requestedModelId.split(":")[0] ?? "";
  const key =
    provider === "openai"
      ? input.openaiApiKey.trim()
      : provider === "fireworks"
        ? input.fireworksApiKey.trim()
        : "";

  if (!input.useCredits && BYO_PROVIDERS.has(provider) && key) {
    return { modelId: input.requestedModelId, apiKey: key, billCredits: false };
  }

  return {
    modelId: resolveModelId(input.requestedModelId, input.models),
    billCredits: true,
  };
}
