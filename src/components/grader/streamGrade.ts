import { readStreamableValue } from "@ai-sdk/rsc";
import { generateGrade } from "@/actions/generateResponse";
import { extractGrade } from "@/lib/utils/responseParser";
import type { GradingData } from "@/lib/types/grading-data";
import type { ProfileType } from "@/zustand/useProfileStore";

export const GRADING_FAILED_MESSAGE =
  "We couldn't grade this draft right now. Your text is still here, so please try again in a moment.";

interface StreamGradeArgs {
  modelId: string;
  profile: ProfileType;
  data: GradingData;
  rubricString: string;
  /** Receives the balance after the server debited this grading. */
  onCredits: (credits: number) => void;
  onUpdate: (feedback: string, grade: string) => void;
}

/**
 * Requests a grade (the server verifies the session and debits credits), then
 * streams the feedback through `onUpdate`. Resolves with the final feedback and grade.
 */
export async function streamGrade({
  modelId,
  profile,
  data,
  rubricString,
  onCredits,
  onUpdate,
}: StreamGradeArgs) {
  const { result, credits } = await generateGrade(
    modelId,
    profile.identity || "",
    profile.identityLevel || "",
    data.assigner,
    data.topic,
    data.prose,
    data.audience,
    data.wordLimitType,
    data.wordLimit,
    rubricString,
    data.title,
    data.text
  );

  if (!result) throw new Error("No response");
  onCredits(credits);

  let feedback = "";
  let grade = "";
  for await (const content of readStreamableValue(result)) {
    if (content) {
      feedback = content.trim();
      grade = extractGrade(feedback);
      onUpdate(feedback, grade);
    }
  }
  return { feedback, grade };
}
