import type { LanguageModel, ModelMessage } from "ai";
import { streamText } from "ai";

interface StreamUsage {
  inputTokens: number;
  outputTokens: number;
}

interface OnFinishParams {
  usage: StreamUsage;
}

interface StreamTextParams {
  model: LanguageModel;
  messages: ModelMessage[];
  temperature: number;
  onFinish: (params: OnFinishParams) => Promise<void>;
}

/**
 * Executes a streaming text generation using GPT models.
 * Streams results back to the client and invokes a callback on finish.
 */
export async function executeStreamText({
  model,
  messages,
  temperature,
  onFinish,
}: StreamTextParams) {
  try {
    const result = streamText({
      model,
      messages,
      temperature,
      onFinish: async (event) => {
        const usage = {
          inputTokens: event.usage.inputTokens ?? 0,
          outputTokens: event.usage.outputTokens ?? 0,
        };

        console.log("[executeStreamText] Stream completed with usage:", usage);

        // Invoke the provided callback with usage and the final result.
        await onFinish({ usage });
      },
    });

    return result;
  } catch (error) {
    console.error("[executeStreamText] Error during streamText execution:", error);
    throw new Error("Failed to execute streamText.");
  }
}
