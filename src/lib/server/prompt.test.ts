import { describe, expect, it } from "vitest";
import { streamText, type ModelMessage } from "ai";
import { MockLanguageModelV4, convertArrayToReadableStream } from "ai/test";
import { toPrompt } from "./prompt";

const messages: ModelMessage[] = [
  { role: "system", content: "You are a grader." },
  { role: "user", content: "Grade this." },
];

const mockModel = () =>
  new MockLanguageModelV4({
    doStream: async () => ({
      stream: convertArrayToReadableStream([
        { type: "text-start", id: "t" },
        { type: "text-delta", id: "t", delta: "Grade: 90%" },
        { type: "text-end", id: "t" },
        {
          type: "finish",
          finishReason: { unified: "stop", raw: "stop" },
          usage: {
            inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
            outputTokens: { total: 4, text: 4, reasoning: 0 },
          },
        },
      ]),
    }),
  });

describe("toPrompt", () => {
  it("moves system messages into instructions", () => {
    const prompt = toPrompt(messages);
    expect(prompt.instructions).toEqual([messages[0]]);
    expect(prompt.messages).toEqual([messages[1]]);
  });

  it("is accepted by the real streamText, which rejects system messages in messages", async () => {
    let streamError: unknown;
    const rejected = streamText({ model: mockModel(), messages, onError: ({ error }) => void (streamError = error) });
    await expect(rejected.text).rejects.toThrow();
    expect(String(streamError)).toMatch(/System messages are not allowed/);

    const accepted = streamText({ model: mockModel(), ...toPrompt(messages) });
    await expect(accepted.text).resolves.toBe("Grade: 90%");
  });
});
