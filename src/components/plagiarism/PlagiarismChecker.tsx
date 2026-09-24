"use client";

import { useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { CheckCircle2, ScanSearch } from "lucide-react";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore from "@/zustand/useProfileStore";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { countWords, estimateScanCredits } from "./report";

interface PlagiarismCheckerProps {
  /** Text to pre-fill, e.g. the essay open in the grader. */
  text?: string;
  /** Custom trigger element; defaults to an outline "Plagiarism check" button. */
  trigger?: ReactNode;
  onSubmitted?: (docId: string) => void;
}

export function PlagiarismChecker({ text = "", trigger, onSubmitted }: PlagiarismCheckerProps) {
  const textareaId = useId();
  const { uid } = useAuthStore();
  const { profile, minusCredits } = useProfileStore();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(text);
  const [isChecking, setIsChecking] = useState(false);
  const [reportLink, setReportLink] = useState("");

  const words = countWords(draft);
  const estimate = estimateScanCredits(draft);
  const lowCredits = estimate > 0 && profile.credits < estimate;

  const handleOpenChange = (next: boolean) => {
    if (isChecking) return;
    if (next) {
      setDraft(text);
      setReportLink("");
    }
    setOpen(next);
  };

  const handleCheck = async () => {
    // A second submit while a scan is in flight would charge for another scan.
    if (isChecking || !draft.trim()) return;
    setIsChecking(true);

    try {
      const response = await fetch("/api/copyleaks/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          text: draft,
          availableCredits: profile.credits,
          useCredits: profile.useCredits,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Submission failed.");
      }

      const { docId, creditsUsed } = await response.json();
      const creditsDeducted = await minusCredits(creditsUsed);
      if (!creditsDeducted) {
        throw new Error("Failed to deduct credits.");
      }

      setReportLink(`/plagiarism-check/${uid}/${docId}`);
      toast.success("Submission successful! Your report is being generated.");
      onSubmitted?.(docId);
    } catch (error) {
      console.error("Error checking plagiarism:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="grader-plagiarism-button">
            <ScanSearch aria-hidden />
            <span className="max-sm:sr-only">Plagiarism check</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        {reportLink ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-success-soft text-success">
              <CheckCircle2 className="size-6" aria-hidden />
            </span>
            <DialogTitle>Scan submitted</DialogTitle>
            <DialogDescription>
              Your report is being generated. It usually takes a minute or two.
            </DialogDescription>
            <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button asChild>
                <Link href={reportLink} onClick={() => setOpen(false)}>
                  View report
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Plagiarism &amp; AI check</DialogTitle>
              <DialogDescription>
                Compare your text against web sources and scan it for AI-generated passages.
              </DialogDescription>
            </DialogHeader>
            <Field
              label="Text to scan"
              htmlFor={textareaId}
              hint={
                words > 0
                  ? `${words.toLocaleString()} words · about ${estimate.toLocaleString()} credits (you have ${profile.credits.toLocaleString()})`
                  : "Paste an essay or passage. Cost is based on word count."
              }
            >
              <Textarea
                id={textareaId}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Paste text here…"
                disabled={isChecking}
                className="min-h-48 font-serif text-base scrollbar-thin"
              />
            </Field>
            {lowCredits && (
              <p className="rounded-lg bg-warning-soft px-3 py-2 text-sm">
                You may not have enough credits for this scan.{" "}
                <Link href="/payment-attempt" className="font-medium text-primary underline-offset-4 hover:underline">
                  Buy credits
                </Link>
              </p>
            )}
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)} disabled={isChecking}>
                Cancel
              </Button>
              <Button onClick={handleCheck} loading={isChecking} disabled={!draft.trim()}>
                {isChecking ? "Submitting…" : "Start scan"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
