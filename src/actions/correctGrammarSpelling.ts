"use server";

import { CoreMessage, streamText } from "ai";
import { getModel } from "@/lib/utils/registry";
import { getApiKeys } from "@/lib/utils/user";

// Function to validate input parameters
function validateInputs(text: string): { valid: boolean; error?: string } {
  if (!text.trim()) return { valid: false, error: "Input text cannot be empty." };
  return { valid: true };
}

// Function to estimate token usage for the input text
function estimateTokens(text: string): number {
  const totalChars = text.length;
  return Math.ceil(totalChars / 4); // Rough estimate: 1 token per 4 characters
}

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

// Function to generate grammar and spelling corrections
async function generateGrammarCorrections(
  messages: CoreMessage[],
  inputTokenEstimate: number,
  estimatedOutputTokens: number,
  availableCredits: number,
  useCredits: boolean,
  selectedModelId: string,
  apiKey: string
) {
  const creditsPerDollar = Number(process.env.NEXT_PUBLIC_CREDITS_PER_DOLLAR) || 500;
  const creditsPerInputToken = Number(process.env.NEXT_PUBLIC_CREDITS_PER_INPUT_TOKEN) || 0.000005;
  const creditsPerOutputToken = Number(process.env.NEXT_PUBLIC_CREDITS_PER_OUTPUT_TOKEN) || 0.000015;

  const model = getModel(selectedModelId, apiKey);

  // Estimate token usage
  if (useCredits) {
    const estimatedCreditCost = (inputTokenEstimate * creditsPerInputToken + estimatedOutputTokens * creditsPerOutputToken) * creditsPerDollar * 1.5; // 50% buffer

    if (availableCredits < estimatedCreditCost) {
      throw new Error("Not enough credits to process the request.");
    }
  }

  // Proceed with API call
  const { textStream, usage } = await streamText({
    model,
    messages,
    temperature: 0, // Deterministic response for grammar correction
  });

  // Handle the streamable value correctly using the SDK's methods
  const chunks: string[] = [];
  for await (const chunk of textStream) {
    chunks.push(chunk);
  }

  const usageResult = await usage;
  const inputTokens = usageResult.inputTokens ?? 0;
  const outputTokens = usageResult.outputTokens ?? 0;

  const creditsUsed = useCredits
    ? (inputTokens * creditsPerInputToken + outputTokens * creditsPerOutputToken) * creditsPerDollar
    : 0;

  return {
    chunks,
    creditsUsed,
  };
}

// Create the system and user messages for correction
function createCorrectionMessages(text: string): CoreMessage[] {
  const systemPrompt = `You are a highly accurate grammar and spelling checker. Please correct all grammar, spelling, and punctuation errors in the following text.`;
  const userPrompt = `Here is the text to correct: \n"${text}"`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];
}

// Main function to handle grammar correction request
export async function correctGrammarAndSpelling(
  text: string,
  availableCredits: number,
  useCredits: boolean,
  userId: string,
  selectedModelId: string
) {
  const validation = validateInputs(text);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const inputTokenEstimate = estimateTokens(text);
  const maxInputTokens = 16384;
  const estimatedOutputTokens = inputTokenEstimate;

  let chunks: string[] = [text];
  if (inputTokenEstimate > maxInputTokens) {
    chunks = splitTextIntoChunks(text, maxInputTokens);
  }

  const correctedTextArray: string[] = [];
  let totalCreditsUsed = 0;

  let apiKey = '';
  if (!useCredits) {
    const apiKeys = await getApiKeys(userId);
    if (!apiKeys) {
      throw new Error("User API keys not found");
    }
    const [provider] = selectedModelId.split(':');
    apiKey = provider === 'openai' ? apiKeys.openai_api_key : apiKeys.fireworks_api_key;
  }

  // Process each chunk and push the results to the array
  for (const chunk of chunks) {
    const messages = createCorrectionMessages(chunk);
    const { chunks: resultChunks, creditsUsed } = await generateGrammarCorrections(
      messages,
      inputTokenEstimate,
      estimatedOutputTokens,
      availableCredits,
      useCredits,
      selectedModelId,
      apiKey
    );

    // Combine all result chunks into corrected text
    correctedTextArray.push(...resultChunks);

    totalCreditsUsed += creditsUsed;

    if (useCredits && totalCreditsUsed > availableCredits) {
      throw new Error("Insufficient credits to continue processing.");
    }
  }

  return {
    correctedTextArray, // Return all corrected text chunks
    totalCreditsUsed,
  };
}

