"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// Function to validate input parameters
function validateInputs(
  topic: string,
  words: string
): { valid: boolean; error?: string } {
  if (!topic.trim()) return { valid: false, error: "Topic cannot be empty." };
  if (!words.trim())
    return { valid: false, error: "Class level cannot be empty." };
  return { valid: true };
}

// Function to generate a deterministic response using OpenAI
async function generateDeterministicResponse(messages: CoreMessage[]) {
  const model = openai("gpt-4o");

  const result = await streamText({
    model,
    messages,
    temperature: 0, // Deterministic response
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}

// Helper function to create the grading messages
function createGradingMessages(topic: string, words: string): CoreMessage[] {
  const systemPrompt = `Respond as a writing teacher at the ${
    words || "college"
  } level. Your response should be in the form of a letter grade and an explanation.`;
  const userPrompt = `Please grade the essay that follows: \n${topic}`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];
}

// Function specific to grading essays
export async function generateGrade(topic: string, words: string) {
  const validation = validateInputs(topic, words);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const messages = createGradingMessages(topic, words);
  return await generateDeterministicResponse(messages);
}
