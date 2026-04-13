// /lib/utils/textUtils.ts

export function validateInputs(text: string): { valid: boolean; error?: string } {
  if (!text.trim()) {
    return { valid: false, error: "Input text cannot be empty." };
  }
  return { valid: true };
}


export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
