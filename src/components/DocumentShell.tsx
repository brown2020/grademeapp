"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { Layers, Wand2 } from "lucide-react";
import type { GradingData } from "@/lib/types/grading-data";
import type { ProfileType } from "@/zustand/useProfileStore";
import { PlagiarismChecker } from "@/components/plagiarism/PlagiarismChecker";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/components/ui/page";
import DownloadPopover from "@/components/ui/DownloadPopover";
import { GradeBadge } from "@/components/grader/GradeBadge";
import { GradeResult } from "@/components/grader/GradeResult";
import { GradingError, GradingPending } from "@/components/grader/GradingStatus";
import { GradingPanel } from "@/components/grader/GradingPanel";
import { MobileRubricBar } from "@/components/grader/RubricSummary";
import { TitleInput } from "@/components/grader/TitleInput";
import { WorkspaceLayout } from "@/components/grader/WorkspaceLayout";

export interface DocumentShellProps {
  summaryID: string;
  submittedAt: Date;
  gradingData: GradingData;
  setGradingData: (data: Partial<GradingData>) => void;
  profile: ProfileType;
  summary: string;
  grade: string;
  flagged: string;
  thinking: boolean;
  correcting: boolean;
  canSubmit: boolean;
  selectedModelId: string;
  onModelChange: (id: string) => void;
  onSubmit: (e: FormEvent) => void;
  onFixGrammarSpelling: () => void;
}

const dateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

/** Editor-centric view of one saved submission: revise, correct, re-grade. */
export default function DocumentShell({
  summaryID,
  submittedAt,
  gradingData,
  setGradingData,
  profile,
  summary,
  grade,
  flagged,
  thinking,
  correcting,
  canSubmit,
  selectedModelId,
  onModelChange,
  onSubmit,
  onFixGrammarSpelling,
}: DocumentShellProps) {
  const busy = thinking || correcting;

  return (
    <PageContainer size="wide">
      <PageHeader
        eyebrow={`Submission · ${dateFormat.format(submittedAt)}`}
        title="Revise and re-grade"
        description="Edit your draft, fix grammar and spelling, then grade it again. Each grade is saved as a new version."
        actions={
          <div className="flex items-center gap-3">
            <Button asChild variant="secondary" size="sm">
              <Link href={`/assignments/${summaryID}`}>
                <Layers />
                All versions
              </Link>
            </Button>
            <GradeBadge grade={grade} size="md" />
          </div>
        }
      />
      <WorkspaceLayout
        onSubmit={onSubmit}
        editor={
          <>
            <MobileRubricBar rubric={gradingData.rubric} changeable={false} />
            <TitleInput value={gradingData.title} onChange={(title) => setGradingData({ title })} />
            <RichTextEditor
              value={gradingData.text}
              onChange={(text) => setGradingData({ text })}
              wordLimit={gradingData.wordLimit}
              wordLimitType={gradingData.wordLimitType}
            />
          </>
        }
        panel={
          <GradingPanel
            rubric={gradingData.rubric}
            rubricChangeable={false}
            modelId={selectedModelId}
            onModelChange={onModelChange}
            profile={profile}
            canSubmit={canSubmit}
            thinking={thinking}
            submitLabel="Re-grade"
          >
            <Button
              variant="secondary"
              size="sm"
              loading={correcting}
              disabled={busy || gradingData.text.length <= 1}
              onClick={onFixGrammarSpelling}
            >
              {!correcting && <Wand2 />}
              Fix grammar &amp; spelling
            </Button>
            <DownloadPopover
              content={gradingData.text}
              fileName={gradingData.title || "document"}
              size="sm"
            />
            <PlagiarismChecker text={gradingData.text} />
          </GradingPanel>
        }
        results={
          <>
            {thinking && !summary && !flagged && <GradingPending />}
            {flagged && <GradingError message={flagged} />}
            {!flagged && summary && (
              <GradeResult
                grade={grade}
                feedback={summary}
                streaming={thinking}
                rubricName={gradingData.rubric?.name}
              />
            )}
          </>
        }
      />
    </PageContainer>
  );
}
