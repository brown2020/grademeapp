import { readStreamableValue } from "@ai-sdk/rsc";
import { generateGrade } from "@/actions/generateResponse";
import { extractGrade } from "@/lib/utils/responseParser";
import type { GradingData } from "@/lib/types/grading-data";
import type { ProfileType } from "@/zustand/useProfileStore";

export const GRADING_FAILED_MESSAGE =
  "No suggestions found. Servers might be overloaded right now.";

interface StreamGradeArgs {
  modelId: string;
  profile: ProfileType;
  data: GradingData;
  rubricString: string;
  uid: string;
  minusCredits: (amount: number) => Promise<boolean>;
  onUpdate: (feedback: string, grade: string) => void;
}

/**
 * Requests a grade, deducts the credits it cost, then streams the feedback
 * through `onUpdate`. Resolves with the final feedback and grade.
 */
export async function streamGrade({
  modelId,
  profile,
  data,
  rubricString,
  uid,
  minusCredits,
  onUpdate,
}: StreamGradeArgs) {
  const { result, creditsUsed } = await generateGrade(
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
    data.text,
    profile.credits,
    profile.useCredits,
    uid
  );

  if (!result) throw new Error("No response");
  if (!(await minusCredits(creditsUsed))) throw new Error("Failed to deduct credits.");

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
