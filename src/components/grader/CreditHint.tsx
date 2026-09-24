import Link from "next/link";
import { Coins, KeyRound } from "lucide-react";
import type { ProfileType } from "@/zustand/useProfileStore";

const LOW_CREDIT_THRESHOLD = 10;

/** Explains how grading is paid for: credits balance or the user's own API keys. */
export function CreditHint({ profile }: { profile: ProfileType }) {
  if (!profile.useCredits) {
    return (
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <KeyRound className="size-3.5 shrink-0" aria-hidden />
        Using your own API keys
      </p>
    );
  }

  const credits = Math.floor(profile.credits);
  if (credits < LOW_CREDIT_THRESHOLD) {
    return (
      <p className="flex flex-wrap items-center gap-1.5 text-xs text-destructive">
        <Coins className="size-3.5 shrink-0" aria-hidden />
        {credits <= 0
          ? "You're out of credits."
          : `Only ${credits} credits left.`}
        <Link href="/profile" className="font-medium underline underline-offset-4">
          Get credits
        </Link>
      </p>
    );
  }

  return (
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Coins className="size-3.5 shrink-0" aria-hidden />
      <span>
        <span className="tabular-nums font-medium text-foreground">
          {credits.toLocaleString()}
        </span>{" "}
        credits · cost depends on length and model
      </span>
    </p>
  );
}
