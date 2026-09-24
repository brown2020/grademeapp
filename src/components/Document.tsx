"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc as firestoreDoc, getDoc, Timestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { FileQuestion } from "lucide-react";
import { db } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore from "@/zustand/useProfileStore";
import { useRubricStore } from "@/zustand/useRubricStore";
import { correctGrammarAndSpelling } from "@/actions/correctGrammarSpelling";
import { updateDocument } from "@/lib/utils/saveHistory";
import type { GradingData } from "@/lib/types/grading-data";
import type { Submission, UserHistoryType } from "@/lib/types/user-history";
import { Button } from "@/components/ui/button";
import { EmptyState, PageContainer } from "@/components/ui/page";
import { PageLoader } from "@/components/ui/spinner";
import { GRADING_FAILED_MESSAGE, streamGrade } from "@/components/grader/streamGrade";
import { useScrollIntoView } from "@/components/grader/useScrollIntoView";
import { useSelectedModel } from "@/components/grader/useSelectedModel";
import DocumentShell from "./DocumentShell";

async function fetchDocumentById(uid: string, id: string) {
  const snap = await getDoc(firestoreDoc(db, "users", uid, "summaries", id));
  return snap.exists() ? (snap.data() as UserHistoryType) : null;
}

type Busy = "grading" | "correcting" | null;

export default function Document() {
  const uid = useAuthStore((s) => s.uid);
  const { profile, minusCredits } = useProfileStore();
  const { gradingData, setGradingData } = useRubricStore();
  const params = useParams<{ summaryID: string; timestamp: string }>();
  const summaryID = params?.summaryID ?? "";
  const timestampMillis = Number(params?.timestamp);
  const [selectedModelId, setSelectedModelId] = useSelectedModel();

  const [userDoc, setUserDoc] = useState<UserHistoryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [grade, setGrade] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [flagged, setFlagged] = useState("");
  const [busy, setBusy] = useState<Busy>(null);
  const [justGraded, setJustGraded] = useState(false);

  const thinking = busy === "grading";
  const canSubmit =
    gradingData.text.length > 1 && (profile.credits > 0 || !profile.useCredits) && !busy;

  useScrollIntoView(
    flagged
      ? "flagged"
      : thinking && !summary
        ? "thinking"
        : justGraded && summary
          ? "response"
          : null
  );

  useEffect(() => {
    if (!uid || !summaryID || Number.isNaN(timestampMillis)) return;
    const submissionTimestamp = Timestamp.fromMillis(timestampMillis);
    let cancelled = false;

    void (async () => {
      try {
        const loaded = await fetchDocumentById(uid, summaryID);
        if (cancelled) return;
        setUserDoc(loaded);
        const match = loaded?.submissions.find(
          (sub) =>
            sub.timestamp.seconds === submissionTimestamp.seconds &&
            sub.timestamp.nanoseconds === submissionTimestamp.nanoseconds
        );
        if (loaded && match) {
          const input = loaded.userInput;
          setGradingData({
            title: input.title,
            text: match.text,
            assigner: input.assigner,
            textType: input.textType,
            topic: input.topic,
            prose: input.prose,
            audience: input.audience,
            wordLimitType: input.wordLimitType as GradingData["wordLimitType"],
            wordLimit: input.wordLimit,
            customRubric: input.customRubric,
            rubric: input.rubric,
          });
          setSummary(match.response);
          setGrade(match.grade);
          setFileUrl(loaded.fileUrl);
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Error in getDocument", error);
        toast.error("Failed to load document");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uid, summaryID, timestampMillis, setGradingData]);

  const saveSubmission = async (response: string, finalGrade: string) => {
    const submission: Submission = {
      text: gradingData.text,
      response,
      grade: finalGrade,
      timestamp: Timestamp.now(),
    };
    const submissions = [...(userDoc?.submissions ?? []), submission];
    await updateDocument(uid, summaryID, gradingData, submissions, fileUrl || null);
    setUserDoc((prev) => (prev ? { ...prev, submissions } : prev));
    toast.success("Document updated successfully");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy("grading");
    setSummary("");
    setFlagged("");
    setJustGraded(false);

    let result: { feedback: string; grade: string };
    try {
      result = await streamGrade({
        modelId: selectedModelId,
        profile,
        data: gradingData,
        rubricString: JSON.stringify(gradingData.rubric),
        uid,
        minusCredits,
        onUpdate: (feedback, nextGrade) => {
          setSummary(feedback);
          setGrade(nextGrade);
        },
      });
    } catch (error) {
      console.error(error);
      setFlagged(GRADING_FAILED_MESSAGE);
      return;
    } finally {
      setBusy(null);
    }

    setJustGraded(true);
    if (!uid || !summaryID) return;
    try {
      await saveSubmission(result.feedback, result.grade);
    } catch (error) {
      console.error("Failed to save submission:", error);
      toast.error("Graded, but couldn't save this version.");
    }
  };

  const handleFixGrammarSpelling = async () => {
    setFlagged("");
    setBusy("correcting");
    try {
      const { correctedTextArray, totalCreditsUsed } = await correctGrammarAndSpelling(
        gradingData.text,
        profile.credits,
        profile.useCredits,
        uid,
        selectedModelId
      );
      const finalText = correctedTextArray.join("");
      if (!finalText) throw new Error("No response");
      if (!(await minusCredits(totalCreditsUsed))) throw new Error("Failed to deduct credits.");
      setGradingData({ text: finalText });
    } catch (error) {
      console.error(error);
      setFlagged(GRADING_FAILED_MESSAGE);
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <PageLoader label="Loading document" />;

  if (!userDoc) {
    return (
      <PageContainer>
        <EmptyState
          icon={<FileQuestion />}
          title="Document not found"
          description="It may have been deleted, or the link is out of date."
          action={
            <Button asChild variant="secondary">
              <Link href="/assignments">Back to history</Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <DocumentShell
      summaryID={summaryID}
      submittedAt={new Date(timestampMillis)}
      gradingData={gradingData}
      setGradingData={setGradingData}
      profile={profile}
      summary={summary}
      grade={grade}
      flagged={flagged}
      thinking={thinking}
      correcting={busy === "correcting"}
      canSubmit={canSubmit}
      selectedModelId={selectedModelId}
      onModelChange={setSelectedModelId}
      onSubmit={handleSubmit}
      onFixGrammarSpelling={handleFixGrammarSpelling}
    />
  );
}
