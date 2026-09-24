"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { History, RefreshCw, RotateCcw } from "lucide-react";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore from "@/zustand/useProfileStore";
import { useRubricStore } from "@/zustand/useRubricStore";
import { saveDocument } from "@/lib/utils/saveHistory";
import { PlagiarismChecker } from "@/components/plagiarism/PlagiarismChecker";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/components/ui/page";
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

export default function Grader() {
  const uid = useAuthStore((s) => s.uid);
  const { profile, minusCredits } = useProfileStore();
  const { selectedRubric, gradingData, setGradingData } = useRubricStore();
  const [selectedModelId, setSelectedModelId] = useSelectedModel();
  const { uploading, fileUrl, upload } = useDocumentUpload(uid);

  const [response, setResponse] = useState("");
  const [grade, setGrade] = useState("");
  const [flagged, setFlagged] = useState("");
  const [thinking, setThinking] = useState(false);

  const hasCredits = profile.credits > 0 || !profile.useCredits;
  const canSubmit = gradingData.text.length > 1 && hasCredits && !thinking && !uploading;

  useScrollIntoView(
    response ? "response" : flagged ? "flagged" : thinking ? "thinking" : null
  );

  const runGrading = async () => {
    if (!canSubmit) return;
    setResponse("");
    setGrade("");
    setFlagged("");
    setThinking(true);

    const data = { ...gradingData, rubric: selectedRubric };
    setGradingData({ rubric: selectedRubric });

    let result: { feedback: string; grade: string };
    try {
      result = await streamGrade({
        modelId: selectedModelId,
        profile,
        data,
        rubricString: JSON.stringify(selectedRubric),
        uid,
        minusCredits,
        onUpdate: (feedback, nextGrade) => {
          setResponse(feedback);
          setGrade(nextGrade);
        },
      });
    } catch (error) {
      console.error(error);
      setFlagged(GRADING_FAILED_MESSAGE);
      return;
    } finally {
      setThinking(false);
    }

    if (!result.feedback) return;
    try {
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
          (thinking || flagged || response) && (
            <>
              {thinking && !response && <GradingPending />}
              {flagged && <GradingError message={flagged} />}
              {response && (
                <GradeResult
                  grade={grade}
                  feedback={response}
                  streaming={thinking}
                  rubricName={selectedRubric?.name}
                  actions={
                    <>
                      <Button asChild variant="ghost" size="sm">
                        <Link href="/assignments">
                          <History />
                          View in history
                        </Link>
                      </Button>
                      <DownloadPopover
                        content={gradingData.text}
                        fileName={gradingData.title || "essay"}
                        label="Download .docx"
                        variant="ghost"
                        size="sm"
                      />
                      <Button size="sm" variant="secondary" onClick={runGrading} disabled={!canSubmit}>
                        <RefreshCw />
                        Grade again
                      </Button>
                    </>
                  }
                />
              )}
            </>
          )
        }
      />
    </PageContainer>
  );
}
