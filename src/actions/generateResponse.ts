"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { isProviderEnabled, getModel } from "@/lib/utils/registry";
import { getApiKeys } from "@/lib/utils/user";


// Function to validate input parameters
function validateInputs(topic: string): { valid: boolean; error?: string } {
  if (!topic.trim()) return { valid: false, error: "Topic cannot be empty." };
  return { valid: true };
}

// Function to calculate token count for input and estimate for output
async function estimateTokens(messages: CoreMessage[], estimatedOutputTokens: number) {

  // Concatenate all message contents into a single string
  const text = messages.map(message => message.content).join(' ');

  // Calculate the token count for the input text
  const totalChars = text.length;
  const inputTokensCount = Math.ceil(totalChars / 4);

  // Return input tokens and estimated output tokens
  return {
    inputTokens: inputTokensCount,
    outputTokens: estimatedOutputTokens,
  };
}

// Function to generate a deterministic response using OpenAI
async function generateDeterministicResponse(
  selectedModelId: string,
  messages: CoreMessage[],
  estimatedOutputTokens: number,
  availableCredits: number,
  useCredits: boolean,
  fireworks_api_key: string,
  openai_api_key: string,
) {
  const creditsPerDollar = Number(process.env.NEXT_PUBLIC_CREDITS_PER_DOLLAR) || 500 as number;
  const creditsPerInputToken = Number(process.env.NEXT_PUBLIC_CREDITS_PER_INPUT_TOKEN) || 0.000005 as number;
  const creditsPerOutputToken = Number(process.env.NEXT_PUBLIC_CREDITS_PER_OUTPUT_TOKEN) || 0.000015 as number;

  const providerId = selectedModelId ? selectedModelId.split(':')[0] : 'openai'

  if (!isProviderEnabled(providerId) && useCredits) {
    console.log(`Provider ${providerId} is not available (API key not configured or base URL not set)`)
  }

  // Set the API key based on the provider
  let apiKey = '';
  if (!useCredits) {
    if (providerId === 'fireworks') {
      apiKey = fireworks_api_key;
    } else if (providerId === 'openai') {
      apiKey = openai_api_key;
    }
  }

  const model = !isProviderEnabled(providerId) && useCredits
    ? getModel('openai:gpt-4o')
    : getModel(selectedModelId, apiKey);

  // Estimate token usage before making the request
  const { inputTokens, outputTokens } = await estimateTokens(messages, estimatedOutputTokens);
  const estimatedCreditCost = (inputTokens * 0.000005) + (outputTokens * 0.000015) * creditsPerDollar * 1.5; // Add 50% buffer

  // If the user does not have enough credits, throw an error
  if (availableCredits < estimatedCreditCost) {
    throw new Error("Not enough credits to process the request.");
  }

  // Proceed with the API call if the user has enough credits
  const { textStream, usage } = streamText({
    model,
    messages,
    temperature: 0, // Deterministic response
  });

  const stream = createStreamableValue(textStream);

  // Calculate the actual credits used based on the usage returned by the API
  const creditsUsed = ((await usage).promptTokens * creditsPerInputToken + (await usage).completionTokens * creditsPerOutputToken) * creditsPerDollar;


  return {
    result: stream.value,
    creditsUsed,
  };
};

// Helper function to create the grading messages
function createGradingMessages(
  identity: string,
  identityLevel: string,
  assigner: string,
  topic: string,
  prose: string,
  audience: string,
  wordLimitType: string,
  wordLimit: string,
  rubricString: string,
  title: string,
  text: string,
): CoreMessage[] {

  // Construct the system prompt based on user-provided inputs for enhanced accuracy
  const systemPrompt = `You are a ${assigner} grading a ${prose}, in which a ${identityLevel} ${identity} is writing about ${topic} for his/her ${audience}. Grade the paper according this rubric: ${rubricString}. The word limit for this assignment is ${wordLimitType} ${wordLimit}. Assess whether the chosen topic, content and level of writing is appropriate for the age and expected skill level of the user. Provide a percentage grade. If the rubric has additional scoring metrics be sure to include your assessment according to those as well, and constructive feedback in the form of a detailed explanation. ALWAYS provide suggestions for improvement. Begin with positive feedback. Include specific quotes from the text to support your evaluation with ideas for improvement.`;

  // Provide the student's writing content to be graded
  const userPrompt = `Title: ${title} \n\nPlease review and grade the following essay based on the instructions above:\n\n${text}`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];
}

// Function specific to grading essays
export async function generateGrade(
  selectedModelId: string,
  identity: string,
  identityLevel: string,
  assigner: string,
  topic: string,
  prose: string,
  audience: string,
  wordLimitType: string,
  wordLimit: string,
  rubricString: string,
  title: string,
  text: string,
  availableCredits: number,
  useCredits: boolean,
  userId: string,
) {
  const validation = validateInputs(text as string);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  let apiKeys = null;
  if (!useCredits) {
    apiKeys = await getApiKeys(userId);
  }

  const { fireworks_api_key, openai_api_key } = apiKeys ?? {};

  // Estimate output tokens based on average response length (adjust this as needed)
  // TODO: Implement a more accurate way to estimate output tokens
  const estimatedOutputTokens = 1000; // Rough estimate for response size

  const messages = createGradingMessages(
    identity,
    identityLevel,
    assigner,
    topic,
    prose,
    audience,
    wordLimitType,
    wordLimit,
    rubricString,
    title,
    text,
  );
  return await generateDeterministicResponse(
    selectedModelId,
    messages,
    estimatedOutputTokens,
    availableCredits,
    useCredits,
    fireworks_api_key,
    openai_api_key,
  );
}
