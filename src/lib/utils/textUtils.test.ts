import { describe, it, expect } from "vitest";
import { validateInputs, estimateTokens } from "@/lib/utils/textUtils";

describe("validateInputs", () => {
  it("rejects empty text", () => {
    expect(validateInputs("")).toEqual({
      valid: false,
      error: "Input text cannot be empty.",
    });
  });

  it("rejects whitespace-only text", () => {
    expect(validateInputs("   \n\t ").valid).toBe(false);
  });

  it("accepts non-empty text", () => {
    expect(validateInputs("An essay.")).toEqual({ valid: true });
  });
});

describe("estimateTokens", () => {
  it("estimates ~1 token per 4 characters, rounding up", () => {
    expect(estimateTokens("")).toBe(0);
    expect(estimateTokens("abcd")).toBe(1);
    expect(estimateTokens("abcde")).toBe(2);
  });
});
