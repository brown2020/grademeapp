"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore from "@/zustand/useProfileStore";
import { CheckCircle, Loader2 } from "lucide-react";
import CustomButton from "@/components/ui/CustomButton";
import plagiarism from "@/app/assets/ai_detect.svg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PlagiarismCheckerProps {
  text: string;
}

export function PlagiarismChecker({ text }: PlagiarismCheckerProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reportLink, setReportLink] = useState("");
  const { uid } = useAuthStore();
  const { profile, minusCredits } = useProfileStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCheck = async () => {
    if (!text.trim()) {
      console.log("No text provided, returning early");
      return;
    }

    setIsChecking(true);
    setIsSuccess(false);

    try {
      const response = await fetch("/api/copyleaks/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          text,
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

      const reportPath = `/plagiarism-check/${uid}/${docId}`;

      setReportLink(reportPath);
      setIsSuccess(true);
      toast.success("Submission successful! Your report is being generated.");
    } catch (error) {
      console.error("Error checking plagiarism:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <CustomButton
          className="grader-plagiarism-button size-12 sm:size-16 btn btn-shiny flex items-center bg-secondary-97 border-2 border-primary-40 rounded-full p-1.5"
          onClick={() => {
            setIsDialogOpen(true);
            handleCheck();
          }}
        >
          {isChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle size={16} />}
          <Image src={plagiarism} alt="Plagiarism check" className="place-self-center place-items-center size-7 sm:size-10" />
        </CustomButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[512px]">
        <DialogHeader>
          <DialogTitle>Plagiarism Check</DialogTitle>
          <DialogDescription>
            {isSuccess ? (
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <p className="mt-4 text-lg font-medium">Your submission was successful!</p>
                <p className="mt-2">Your report is being generated.</p>
                <a
                  href={reportLink}
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  View your report here.
                </a>
              </div>
            ) : isChecking ? (
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-500" />
                <p className="mt-4 text-lg">Checking your submission...</p>
              </div>
            ) : (
              <p className="text-center">Submit a document to check for plagiarism.</p>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
