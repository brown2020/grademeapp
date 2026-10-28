"use server";

import { streamText, type ModelMessage } from "ai";
import { toPrompt } from "@/lib/server/prompt";
import { validateInputs, estimateTokens } from "@/lib/utils/textUtils";
import { requireServerUser } from "@/lib/server/requestAuth";
import { debitCredits, getBilling, reconcileCredits, refundCredits } from "@/lib/server/billing";
import { creditsForTokens, reservedCredits } from "@/lib/server/creditCost";
import { resolveModelAccess, type ModelAccess } from "@/lib/server/modelAccess";
import { isProviderEnabled, getModel } from "@/lib/utils/registry";
import { z } from "zod";
import { getDefaultModelId } from "@/lib/utils";
import { models } from "@/lib/types/models";

const CorrectionRequestSchema = z.object({
  text: z.string().max(200_000),
  selectedModelId: z.string().regex(/^([a-z-]+:[\w.-]+)?$/),
});

// Function to split text into chunks based on max input tokens
function splitTextIntoChunks(text: string, maxInputTokens: number): string[] {
  const words = text.split(" ");
  let chunk = "";
  const chunks: string[] = [];
  let currentTokenCount = 0;

  for (const word of words) {
    const tokenEstimate = estimateTokens(word);
    if (currentTokenCount + tokenEstimate <= maxInputTokens) {
      chunk += word + " ";
      currentTokenCount += tokenEstimate;
    } else {
      chunks.push(chunk.trim());
      chunk = word + " ";
      currentTokenCount = tokenEstimate;
    }
  }

  if (chunk) {
    chunks.push(chunk.trim());
  }

  return chunks;
}

function modelFor(access: ModelAccess) {
  const providerId = access.modelId.split(":")[0] ?? "";
  const modelId =
    access.billCredits && !isProviderEnabled(providerId)
      ? getDefaultModelId(models)
      : access.modelId;
  return access.apiKey ? getModel(modelId, access.apiKey) : getModel(modelId);
}

async function generateGrammarCorrections(messages: ModelMessage[], access: ModelAccess) {
  const { textStream, usage } = streamText({
    model: modelFor(access),
    ...toPrompt(messages),
    temperature: 0,
  });

  const chunks: string[] = [];
  for await (const chunk of textStream) {
    chunks.push(chunk);
  }

  const usageResult = await usage;
  const creditsUsed = access.billCredits
    ? creditsForTokens(usageResult.inputTokens ?? 0, usageResult.outputTokens ?? 0)
    : 0;

  return { chunks, creditsUsed };
}

// Create the system and user messages for correction
function createCorrectionMessages(text: string): ModelMessage[] {
  const systemPrompt = `You are a highly accurate grammar and spelling checker. Please correct all grammar, spelling, and punctuation errors in the following text.`;
  const userPrompt = `Here is the text to correct: \n"${text}"`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];
}

// Main function to handle grammar correction request
export async function correctGrammarAndSpelling(rawText: string, requestedModelId: string) {
  const { text, selectedModelId: requested } = CorrectionRequestSchema.parse({
    text: rawText,
    selectedModelId: requestedModelId,
  });
  const validation = validateInputs(text);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Identity, balance and BYO keys come only from the verified session, never the client.
  const { uid } = await requireServerUser();
  const billing = await getBilling(uid);
  const access = resolveModelAccess({
    requestedModelId: requested,
    useCredits: billing.useCredits,
    openaiApiKey: billing.openaiApiKey,
    fireworksApiKey: billing.fireworksApiKey,
    models,
  });

  const maxInputTokens = 16384;
  const inputTokenEstimate = estimateTokens(text);
  let chunks: string[] = [text];
  if (inputTokenEstimate > maxInputTokens) {
    chunks = splitTextIntoChunks(text, maxInputTokens);
  }

  const reserve = access.billCredits
    ? chunks.reduce((sum, chunk) => {
        const tokens = estimateTokens(chunk);
        return sum + reservedCredits(tokens, tokens);
      }, 0)
    : 0;
  if (reserve > 0) await debitCredits(uid, reserve);

  try {
    const chunkResults = await Promise.all(
      chunks.map((chunk) => generateGrammarCorrections(createCorrectionMessages(chunk), access))
    );
    const correctedTextArray: string[] = [];
    let totalCreditsUsed = 0;
    for (const result of chunkResults) {
      correctedTextArray.push(...result.chunks);
      totalCreditsUsed += result.creditsUsed;
    }
    const credits = reserve > 0 ? await reconcileCredits(uid, reserve, totalCreditsUsed) : billing.credits;
    return { correctedTextArray, totalCreditsUsed, credits };
  } catch (error) {
    if (reserve > 0) {
      await refundCredits(uid, reserve).catch((refundError) =>
        console.error("Failed to refund correction credits:", refundError)
      );
    }
    throw error;
  }
}

