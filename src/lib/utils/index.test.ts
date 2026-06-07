import { describe, it, expect } from "vitest";
import { createModelId, getDefaultModelId } from "@/lib/utils";
import type { Model } from "@/lib/types/models";

const openai: Model = {
  id: "gpt-4o",
  name: "GPT-4o",
  provider: "OpenAI",
  providerId: "openai",
};
const fireworks: Model = {
  id: "accounts/fireworks/models/llama-v3p1-8b-instruct",
  name: "Llama",
  provider: "Fireworks",
  providerId: "fireworks",
};

describe("createModelId", () => {
  it("joins providerId and id with a colon (the registry contract)", () => {
    expect(createModelId(openai)).toBe("openai:gpt-4o");
  });

  it("preserves slashes in provider-scoped model ids", () => {
    expect(createModelId(fireworks)).toBe(
      "fireworks:accounts/fireworks/models/llama-v3p1-8b-instruct"
    );
  });
});

describe("getDefaultModelId", () => {
  it("returns the id of the first model", () => {
    expect(getDefaultModelId([openai, fireworks])).toBe("openai:gpt-4o");
  });

  it("throws when no models are available", () => {
    expect(() => getDefaultModelId([])).toThrow("No models available");
  });
});
