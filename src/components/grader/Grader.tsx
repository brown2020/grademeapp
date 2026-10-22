"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { History, RefreshCw, RotateCcw } from "lucide-react";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore from "@/zustand/useProfileStore";
import { useRubricStore } from "@/zustand/useRubricStore";
import { loadFirestore } from "@/firebase/loadFirestore";
import { saveDocument } from "@/lib/utils/saveHistory";
import type { GradingData } from "@/lib/types/grading-data";
import { PlagiarismChecker } from "@/components/plagiarism/PlagiarismChecker";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/components/ui/page-layout";
import DownloadPopover from "@/components/ui/DownloadPopover";
import { GradeResult } from "./GradeResult";
import { GradingError, GradingPending } from "./GradingStatus";
import { GradingPanel } from "./GradingPanel";
import { MobileRubricBar } from "./RubricSummary";
import { GRADING_FAILED_MESSAGE, streamGrade } from "./streamGrade";
import { TitleInput } from "./TitleInput";
import { UploadButton } from "./UploadButton";
import { useDocumentUpload } from "./useDocumentUpload";
import { useScrollIntoView } from "./useScrollIntoView";
import { useSelectedModel } from "./useSelectedModel";
import { WorkspaceLayout } from "./WorkspaceLayout";

type GradingState = { response: string; grade: string; flagged: string; thinking: boolean };

const IDLE: GradingState = { response: "", grade: "", flagged: "", thinking: false };

/** Runs a grading request, streams its feedback and saves the result to history. */
function useGrading(uid: string, fileUrl: string | null) {
  const { profile, setCredits } = useProfileStore();
  const [state, setState] = useState<GradingState>(IDLE);

  const startGrading = async (data: GradingData, modelId: string) => {
    setState({ ...IDLE, thinking: true });
    let result: { feedback: string; grade: string };
    try {
      result = await streamGrade({
        modelId,
        profile,
        data,
        rubricString: JSON.stringify(data.rubric),
        onCredits: setCredits,
        onUpdate: (response, nextGrade) =>
          setState((s) => ({ ...s, response, grade: nextGrade })),
      });
    } catch (error) {
      console.error(error);
      setState({ ...IDLE, flagged: GRADING_FAILED_MESSAGE });
      return;
    } finally {
      setState((s) => ({ ...s, thinking: false }));
    }
    if (result.feedback) await saveToHistory(uid, data, result, fileUrl);
  };

  return { ...state, startGrading, profile };
}

async function saveToHistory(
  uid: string,
  data: GradingData,
  result: { feedback: string; grade: string },
  fileUrl: string | null
) {
  try {
    const { Timestamp } = await loadFirestore();
    await saveDocument(
      uid,
      data,
      [{ text: data.text, response: result.feedback, grade: result.grade, timestamp: Timestamp.now() }],
      fileUrl
    );
  } catch (error) {
    console.error("Failed to save grading to history:", error);
    toast.error("Graded, but couldn't save to your history.");
  }
}

function scrollTarget({ response, flagged, thinking }: GradingState) {
  if (response) return "response";
  if (flagged) return "flagged";
  return thinking ? "thinking" : null;
}

export default function Grader() {
  const uid = useAuthStore((s) => s.uid);
  const { selectedRubric, gradingData, setGradingData } = useRubricStore();
  const [selectedModelId, setSelectedModelId] = useSelectedModel();
  const { uploading, fileUrl, upload } = useDocumentUpload(uid);
  const grading = useGrading(uid, fileUrl);
  const { profile, response, grade, flagged, thinking } = grading;

  const hasCredits = profile.credits > 0 || !profile.useCredits;
  const canSubmit = gradingData.text.length > 1 && hasCredits && !thinking && !uploading;

  useScrollIntoView(scrollTarget(grading));

  const runGrading = async () => {
    if (!canSubmit) return;
    setGradingData({ rubric: selectedRubric });
    await grading.startGrading({ ...gradingData, rubric: selectedRubric }, selectedModelId);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void runGrading();
  };

  const handleUpload = async (file: File) => {
    if (await upload(file)) {
      document.getElementById("grademe")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <PageContainer size="wide">
      <PageHeader
        eyebrow="Grader"
        title="Grade your writing"
        description="Paste your draft or upload a DOCX, PDF, ODT, RTF or TXT file, then grade it against your rubric."
      />
      <WorkspaceLayout
        onSubmit={handleSubmit}
        editor={
          <>
            <MobileRubricBar rubric={selectedRubric} />
            <TitleInput value={gradingData.title} onChange={(title) => setGradingData({ title })} />
            <RichTextEditor
              value={gradingData.text}
              onChange={(text) => setGradingData({ text })}
              wordLimit={gradingData.wordLimit}
              wordLimitType={gradingData.wordLimitType}
              footerActions={
                <>
                  <UploadButton uploading={uploading} onFile={handleUpload} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setGradingData({ title: "", text: "" })}
                    disabled={thinking || (!gradingData.title && !gradingData.text)}
                  >
                    <RotateCcw />
                    Clear
                  </Button>
                </>
              }
            />
          </>
        }
        panel={
          <GradingPanel
            rubric={selectedRubric}
            modelId={selectedModelId}
            onModelChange={setSelectedModelId}
            profile={profile}
            canSubmit={canSubmit}
            thinking={thinking}
          >
            <PlagiarismChecker text={gradingData.text} />
          </GradingPanel>
        }
        results={
          <GraderResults
            state={grading}
            rubricName={selectedRubric?.name}
            text={gradingData.text}
            title={gradingData.title}
            canRegrade={canSubmit}
            onRegrade={runGrading}
          />
        }
      />
    </PageContainer>
  );
}

function GraderResults({
  state,
  rubricName,
  text,
  title,
  canRegrade,
  onRegrade,
}: {
  state: GradingState;
  rubricName?: string;
  text: string;
  title: string;
  canRegrade: boolean;
  onRegrade: () => void;
}) {
  const { response, grade, flagged, thinking } = state;
  if (!thinking && !flagged && !response) return null;

  return (
    <>
      {thinking && !response && <GradingPending />}
      {flagged && <GradingError message={flagged} />}
      {response && (
        <GradeResult
          grade={grade}
          feedback={response}
          streaming={thinking}
          rubricName={rubricName}
          actions={
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/assignments">
                  <History />
                  View in history
                </Link>
              </Button>
              <DownloadPopover
                content={text}
                fileName={title || "essay"}
                label="Download .docx"
                variant="ghost"
                size="sm"
              />
              <Button size="sm" variant="secondary" onClick={onRegrade} disabled={!canRegrade}>
                <RefreshCw />
                Grade again
              </Button>
            </>
          }
        />
      )}
    </>
  );
}
