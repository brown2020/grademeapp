import { LanguageModelV1, streamText } from "ai";
import { CoreMessage } from "ai";

interface StreamUsage {
  promptTokens: number;
  completionTokens: number;
}

interface OnFinishParams {
  usage: StreamUsage;
}

interface StreamTextParams {
  model: LanguageModelV1;
  messages: CoreMessage[];
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
          promptTokens: event.usage.promptTokens,
          completionTokens: event.usage.completionTokens,
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
