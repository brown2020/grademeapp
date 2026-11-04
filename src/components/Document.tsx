"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc as firestoreDoc, getDoc, Timestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { FileQuestion } from "lucide-react";
import { db } from "@/firebase/firestore";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore, { type ProfileType } from "@/zustand/useProfileStore";
import { useRubricStore } from "@/zustand/useRubricStore";
import { correctGrammarAndSpelling } from "@/actions/correctGrammarSpelling";
import { updateDocument } from "@/lib/utils/saveHistory";
import type { GradingData } from "@/lib/types/grading-data";
import type { Submission, UserHistoryType } from "@/lib/types/user-history";
import { Button } from "@/components/ui/button";
import { EmptyState, PageContainer } from "@/components/ui/page-layout";
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

function scrollTarget(flagged: string, thinking: boolean, summary: string, justGraded: boolean) {
  if (flagged) return "flagged" as const;
  if (thinking && !summary) return "thinking" as const;
  if (justGraded && summary) return "response" as const;
  return null;
}

function submissionAt(loaded: UserHistoryType | null, stamp: Timestamp) {
  return (
    loaded?.submissions.find(
      (sub) => sub.timestamp.seconds === stamp.seconds && sub.timestamp.nanoseconds === stamp.nanoseconds
    ) ?? null
  );
}

function gradingDataFrom(loaded: UserHistoryType, match: Submission): Partial<GradingData> {
  const input = loaded.userInput;
  return {
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
  };
}

async function loadHistoryDocument(
  uid: string,
  summaryID: string,
  timestampMillis: number,
  isCancelled: () => boolean,
  apply: (loaded: UserHistoryType | null, match: Submission | null, fileUrl: string) => void
) {
  const stamp = Timestamp.fromMillis(timestampMillis);
  try {
    const loaded = await fetchDocumentById(uid, summaryID);
    if (isCancelled()) return;
    const match = submissionAt(loaded, stamp);
    apply(loaded, loaded && match ? match : null, loaded?.fileUrl ?? "");
  } catch (error) {
    if (isCancelled()) return;
    console.error("Error in getDocument", error);
    toast.error("Failed to load document");
  }
}

async function saveSubmission(input: {
  uid: string | null;
  summaryID: string;
  gradingData: GradingData;
  userDoc: UserHistoryType | null;
  fileUrl: string;
  response: string;
  finalGrade: string;
  setUserDoc: (value: UserHistoryType | null | ((prev: UserHistoryType | null) => UserHistoryType | null)) => void;
}) {
  const submission: Submission = {
    text: input.gradingData.text,
    response: input.response,
    grade: input.finalGrade,
    timestamp: Timestamp.now(),
  };
  const submissions = [...(input.userDoc?.submissions ?? []), submission];
  await updateDocument(input.uid, input.summaryID, input.gradingData, submissions, input.fileUrl || null);
  input.setUserDoc((prev) => (prev ? { ...prev, submissions } : prev));
  toast.success("Document updated successfully");
}

async function gradeDraft(input: {
  modelId: string;
  profile: ProfileType;
  gradingData: GradingData;
  setCredits: (credits: number) => void;
  setSummary: (value: string) => void;
  setGrade: (value: string) => void;
  setFlagged: (value: string) => void;
  setJustGraded: (value: boolean) => void;
  setBusy: (value: Busy) => void;
  uid: string | null;
  summaryID: string;
  userDoc: UserHistoryType | null;
  fileUrl: string;
  setUserDoc: (value: UserHistoryType | null | ((prev: UserHistoryType | null) => UserHistoryType | null)) => void;
}) {
  input.setSummary("");
  input.setFlagged("");
  input.setJustGraded(false);

  let result: { feedback: string; grade: string };
  try {
    result = await streamGrade({
      modelId: input.modelId,
      profile: input.profile,
      data: input.gradingData,
      rubricString: JSON.stringify(input.gradingData.rubric),
      onCredits: input.setCredits,
      onUpdate: (feedback, nextGrade) => {
        input.setSummary(feedback);
        input.setGrade(nextGrade);
      },
    });
  } catch (error) {
    console.error(error);
    input.setFlagged(GRADING_FAILED_MESSAGE);
    return;
  } finally {
    input.setBusy(null);
  }

  input.setJustGraded(true);
  if (!input.uid || !input.summaryID) return;
  try {
    await saveSubmission({
      uid: input.uid,
      summaryID: input.summaryID,
      gradingData: input.gradingData,
      userDoc: input.userDoc,
      fileUrl: input.fileUrl,
      response: result.feedback,
      finalGrade: result.grade,
      setUserDoc: input.setUserDoc,
    });
  } catch (error) {
    console.error("Failed to save submission:", error);
    toast.error("Graded, but couldn't save this version.");
  }
}

async function correctDraft(input: {
  text: string;
  modelId: string;
  setFlagged: (value: string) => void;
  setCredits: (credits: number) => void;
  setGradingData: (data: Partial<GradingData>) => void;
}) {
  input.setFlagged("");
  try {
    const { correctedTextArray, credits } = await correctGrammarAndSpelling(input.text, input.modelId);
    input.setCredits(credits);
    const finalText = correctedTextArray.join("");
    if (!finalText) throw new Error("No response");
    input.setGradingData({ text: finalText });
  } catch (error) {
    console.error(error);
    input.setFlagged(GRADING_FAILED_MESSAGE);
  }
}

export default function Document() {
  const uid = useAuthStore((s) => s.uid);
  const { profile, setCredits } = useProfileStore();
  const { gradingData, setGradingData } = useRubricStore();
  const params = useParams<{ summaryID: string; timestamp: string }>();
  const summaryID = params?.summaryID ?? "";
  const timestampMillis = Number(params?.timestamp);
  const [selectedModelId, setSelectedModelId] = useSelectedModel();

  const [userDoc, setUserDoc] = useState<UserHistoryType | null>(null);
  const canLoad = Boolean(uid && summaryID && !Number.isNaN(timestampMillis));
  const requestKey = canLoad ? `${uid}:${summaryID}:${timestampMillis}` : "";
  const [activeKey, setActiveKey] = useState(requestKey);
  const [loading, setLoading] = useState(canLoad);
  if (requestKey !== activeKey) {
    setActiveKey(requestKey);
    setLoading(canLoad);
  }
  const [summary, setSummary] = useState("");
  const [grade, setGrade] = useState("");
  const fileUrlRef = useRef("");
  const [flagged, setFlagged] = useState("");
  const [busy, setBusy] = useState<Busy>(null);
  const [justGraded, setJustGraded] = useState(false);

  const thinking = busy === "grading";
  const canSubmit = gradingData.text.length > 1 && (profile.credits > 0 || !profile.useCredits) && !busy;

  useScrollIntoView(scrollTarget(flagged, thinking, summary, justGraded));

  useEffect(() => {
    if (!requestKey || !uid) return;
    let cancelled = false;
    void loadHistoryDocument(uid, summaryID, timestampMillis, () => cancelled, (loaded, match, fileUrl) => {
      setUserDoc(loaded);
      if (!loaded || !match) return;
      setGradingData(gradingDataFrom(loaded, match));
      setSummary(match.response);
      setGrade(match.grade);
      fileUrlRef.current = fileUrl;
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [requestKey, uid, summaryID, timestampMillis, setGradingData]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setBusy("grading");
    await gradeDraft({
      modelId: selectedModelId,
      profile,
      gradingData,
      setCredits,
      setSummary,
      setGrade,
      setFlagged,
      setJustGraded,
      setBusy,
      uid,
      summaryID,
      userDoc,
      fileUrl: fileUrlRef.current,
      setUserDoc,
    });
  };

  const handleFixGrammarSpelling = async () => {
    setBusy("correcting");
    try {
      await correctDraft({
        text: gradingData.text,
        modelId: selectedModelId,
        setFlagged,
        setCredits,
        setGradingData,
      });
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
