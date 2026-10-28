"use server";

import { createStreamableValue } from "@ai-sdk/rsc";
import { streamText, type ModelMessage } from "ai";
import { toPrompt } from "@/lib/server/prompt";
import { isProviderEnabled, getModel } from "@/lib/utils/registry";
import { validateInputs } from "@/lib/utils/textUtils";
import { requireServerUser } from "@/lib/server/requestAuth";
import { debitCredits, getBilling, reconcileCredits, refundCredits } from "@/lib/server/billing";
import { creditsForTokens, reservedCredits } from "@/lib/server/creditCost";
import { trackSettlement } from "@/lib/server/gradeStream";
import { resolveModelAccess, type ModelAccess } from "@/lib/server/modelAccess";
import { z } from "zod";
import { getDefaultModelId } from "@/lib/utils";
import { models } from "@/lib/types/models";

const field = (max: number) => z.string().max(max);
/** Bounds what a client can send; long essays and full rubric JSON fit comfortably. */
const GradeRequestSchema = z.object({
  selectedModelId: z.string().regex(/^([a-z-]+:[\w.-]+)?$/),
  identity: field(100),
  identityLevel: field(100),
  assigner: field(200),
  topic: field(1000),
  prose: field(200),
  audience: field(200),
  wordLimitType: field(50),
  wordLimit: field(20),
  rubricString: field(100_000),
  title: field(300),
  text: field(200_000),
});

function getMessageText(content: ModelMessage["content"]): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part && typeof (part as { text?: unknown }).text === "string") {
          return (part as { text: string }).text;
        }
        return "";
      })
      .filter(Boolean)
      .join(" ");
  }
  return "";
}

// Function to calculate token count for input and estimate for output
async function estimateTokens(messages: ModelMessage[], estimatedOutputTokens: number) {

  // Concatenate all message contents into a single string
  const text = messages.map((message) => getMessageText(message.content)).join(" ");

  // Calculate the token count for the input text
  const totalChars = text.length;
  const inputTokensCount = Math.ceil(totalChars / 4);

  // Return input tokens and estimated output tokens
  return {
    inputTokens: inputTokensCount,
    outputTokens: estimatedOutputTokens,
  };
}

function modelFor(access: ModelAccess) {
  const providerId = access.modelId.split(":")[0] ?? "";
  const modelId =
    access.billCredits && !isProviderEnabled(providerId)
      ? getDefaultModelId(models)
      : access.modelId;
  return access.apiKey ? getModel(modelId, access.apiKey) : getModel(modelId);
}

type Usage = { inputTokens?: number; outputTokens?: number };

function measuredCredits(usage: Usage | undefined, reserved: number): number {
  if (!usage || (usage.inputTokens == null && usage.outputTokens == null)) return reserved;
  return creditsForTokens(usage.inputTokens ?? 0, usage.outputTokens ?? 0);
}

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
): ModelMessage[] {

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
) {
  const input = GradeRequestSchema.parse({
    selectedModelId, identity, identityLevel, assigner, topic, prose, audience,
    wordLimitType, wordLimit, rubricString, title, text,
  });
  const validation = validateInputs(input.text);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Identity, balance and BYO keys come only from the verified session, never the client.
  const { uid } = await requireServerUser();
  const billing = await getBilling(uid);
  const access = resolveModelAccess({
    requestedModelId: input.selectedModelId,
    useCredits: billing.useCredits,
    openaiApiKey: billing.openaiApiKey,
    fireworksApiKey: billing.fireworksApiKey,
    models,
  });

  // Estimate output tokens based on average response length (adjust this as needed)
  // TODO: Implement a more accurate way to estimate output tokens
  const estimatedOutputTokens = 1000;

  const messages = createGradingMessages(
    input.identity,
    input.identityLevel,
    input.assigner,
    input.topic,
    input.prose,
    input.audience,
    input.wordLimitType,
    input.wordLimit,
    input.rubricString,
    input.title,
    input.text,
  );
  const { inputTokens, outputTokens } = await estimateTokens(messages, estimatedOutputTokens);
  const reserve = access.billCredits ? reservedCredits(inputTokens, outputTokens) : 0;
  // Hold the estimate before the provider call so parallel grades cannot all pass a stale check.
  const credits = reserve > 0 ? await debitCredits(uid, reserve) : billing.credits;

  let textStream: AsyncIterable<string>;
  let usage: PromiseLike<Usage>;
  try {
    ({ textStream, usage } = streamText({
      model: modelFor(access),
      ...toPrompt(messages),
      temperature: 0,
    }));
  } catch (error) {
    if (reserve > 0) await refundCredits(uid, reserve);
    throw error;
  }

  const stream = createStreamableValue("");
  // Return the stream immediately. Reconciliation finishes before `done`, which
  // keeps this invocation open until the provider call completes.
  trackSettlement(pipeGrade(stream, textStream, usage, uid, reserve));

  return { result: stream.value, creditsUsed: reserve, credits };
}

async function pipeGrade(
  stream: ReturnType<typeof createStreamableValue<string>>,
  textStream: AsyncIterable<string>,
  usage: PromiseLike<Usage>,
  uid: string,
  reserved: number,
) {
  const safeUsage = Promise.resolve(usage).then(
    (value) => ({ ok: true as const, value }),
    () => ({ ok: false as const, value: undefined })
  );
  try {
    for await (const delta of textStream) {
      if (delta) stream.append(delta);
    }
    const result = await safeUsage;
    if (!result.ok) throw new Error("Grading usage was not reported.");
    if (reserved > 0) {
      await reconcileCredits(uid, reserved, measuredCredits(result.value, reserved));
    }
    stream.done();
  } catch (error) {
    console.error("Grading stream failed:", error);
    if (reserved > 0) {
      await refundCredits(uid, reserved).catch((refundError) =>
        console.error("Failed to refund grading credits:", refundError)
      );
    }
    stream.error(new Error("Grading failed."));
  }
}
