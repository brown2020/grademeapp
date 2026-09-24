"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRubricStore } from "@/zustand/useRubricStore";
import useProfileStore from "@/zustand/useProfileStore";
import RubricHelperFields from "./RubricHelperFields";

const HELPER_DEFAULTS = {
  assigner: "",
  topic: "",
  prose: "",
  audience: "",
  wordLimitType: "less than",
  wordLimit: "",
  textType: "narrative",
} as const;

/** Guided panel that tunes rubric suggestions to the writer and assignment. */
export default function RubricHelper({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const gradingData = useRubricStore((s) => s.gradingData);
  const setGradingData = useRubricStore((s) => s.setGradingData);
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Find the right rubric</DialogTitle>
          <DialogDescription>
            Tell us about you and the assignment. We&apos;ll surface the rubrics that fit best, and
            the grader will use these details too.
          </DialogDescription>
        </DialogHeader>
        <RubricHelperFields
          profile={profile}
          gradingData={gradingData}
          setGradingData={setGradingData}
          updateProfile={updateProfile}
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => setGradingData({ ...HELPER_DEFAULTS })}>
            Reset
          </Button>
          <Button onClick={() => onOpenChange(false)}>Show matches</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
