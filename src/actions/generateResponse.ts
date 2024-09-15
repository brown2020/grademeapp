"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// Original function for general AI response generation
export async function generateResponse(messages: CoreMessage[]) {
  const model = openai("gpt-4o");

  const result = await streamText({
    model,
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}

// New function specific to grading essays
export async function generateGrade(topic: string, words: string) {
  // Construct system and user prompts for grading
  const systemPrompt = `Respond as a writing teacher at the ${
    words || "college"
  } level. Your response should be in the form of a letter grade and a brief explanation.`;
  const userPrompt = `Please grade the essay that follows: \n${topic}`;

  const messages: CoreMessage[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ];

  // Use the original function to generate the response
  return await generateResponse(messages);
}
