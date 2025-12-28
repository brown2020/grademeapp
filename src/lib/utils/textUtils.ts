// /lib/utils/textUtils.ts
import type { ModelMessage } from "ai";


export function validateInputs(text: string): { valid: boolean; error?: string } {
  if (!text.trim()) {
    return { valid: false, error: "Input text cannot be empty." };
  }
  return { valid: true };
}


export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}


export function extractRawTitle(fullText: string): string {
  const lines = fullText.split("\n");
  return lines[0]?.replace(/\n+/g, " ").trim() || "Untitled";
}


export function createPlagiarismCheckMessages(
  text: string,
  bestMatch?: { url: string; similarity: number }
): ModelMessage[] {
  const bestMatchUrl = bestMatch && bestMatch.similarity >= 0.8 ? bestMatch.url : "No significant match found";

  const systemPrompt = `You are a friendly plagiarism checker. You have searched the web for similar content.
We found a best match with similarity of ${bestMatch?.similarity.toFixed(2) ?? 0} 
and link to the source: ${bestMatchUrl}.
The user wants a final report that includes which text is most similar, 
the percentage similarity (over 80% is considered significant),
and a link to the source if above 80%. 
Do everything in your power to figure out if the text is plagiarized, 
and include the final determination in your response.`;

  const userPrompt = `Here is the text to check for plagiarism:\n${text}`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];
}
