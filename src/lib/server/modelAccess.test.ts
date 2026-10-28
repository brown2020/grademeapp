import { describe, expect, it } from "vitest";
import { models } from "@/lib/types/models";
import { resolveModelAccess } from "./modelAccess";

const listed = models[0] ? `${models[0].providerId}:${models[0].id}` : "openai:gpt-6-sol";

describe("resolveModelAccess", () => {
  it("bills credits and keeps the allowlist for platform requests", () => {
    expect(
      resolveModelAccess({
        requestedModelId: "openai:not-a-listed-model",
        useCredits: true,
        openaiApiKey: "sk-user",
        fireworksApiKey: "",
        models,
      })
    ).toEqual({ modelId: listed, billCredits: true });
  });

  it("uses a saved OpenAI key for any OpenAI model without billing credits", () => {
    expect(
      resolveModelAccess({
        requestedModelId: "openai:gpt-6-astra",
        useCredits: false,
        openaiApiKey: " sk-alice ",
        fireworksApiKey: "",
        models,
      })
    ).toEqual({ modelId: "openai:gpt-6-astra", apiKey: "sk-alice", billCredits: false });
  });

  it("uses a saved Fireworks key the same way", () => {
    expect(
      resolveModelAccess({
        requestedModelId: "fireworks:accounts/fireworks/models/llama",
        useCredits: false,
        openaiApiKey: "",
        fireworksApiKey: "fw-key",
        models,
      })
    ).toEqual({
      modelId: "fireworks:accounts/fireworks/models/llama",
      apiKey: "fw-key",
      billCredits: false,
    });
  });

  it("bills credits when BYO mode has no key for the requested provider", () => {
    expect(
      resolveModelAccess({
        requestedModelId: "anthropic:claude-opus-x",
        useCredits: false,
        openaiApiKey: "sk-alice",
        fireworksApiKey: "",
        models,
      })
    ).toEqual({ modelId: listed, billCredits: true });
  });

  it("ignores a blank BYO key and bills credits", () => {
    expect(
      resolveModelAccess({
        requestedModelId: "openai:gpt-6-sol",
        useCredits: false,
        openaiApiKey: "   ",
        fireworksApiKey: "",
        models,
      }).billCredits
    ).toBe(true);
  });
});
