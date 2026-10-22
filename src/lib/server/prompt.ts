import type { ModelMessage, SystemModelMessage } from "ai";

/**
 * Splits system messages out as `instructions`. The AI SDK (v7+) rejects system
 * messages inside `messages` unless explicitly allowed.
 */
export function toPrompt(messages: ModelMessage[]): {
  instructions: SystemModelMessage[];
  messages: ModelMessage[];
} {
  return {
    instructions: messages.filter((m): m is SystemModelMessage => m.role === "system"),
    messages: messages.filter((m) => m.role !== "system"),
  };
}
