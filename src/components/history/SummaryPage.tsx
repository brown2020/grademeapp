"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { ChevronRight, Download, FileQuestion, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState, PageContainer, PageHeader } from "@/components/ui/page-layout";
import { Skeleton } from "@/components/ui/spinner";
import RubricDisplay from "@/components/rubrics/RubricDisplay";
import { UserHistoryType } from "@/lib/types/user-history";
import { useAuthStore } from "@/zustand/useAuthStore";
import { fetchSummary } from "./historyData";
import { formatDate } from "@/lib/utils/date";
import { GradePill } from "./GradePill";
import SubmissionTimeline from "./SubmissionTimeline";

function SummarySkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}

type Submission = UserHistoryType["submissions"][number];

function SummaryHeader({
  summaryID,
  summary,
  first,
  latest,
}: {
  summaryID: string;
  summary: UserHistoryType;
  first?: Submission;
  latest?: Submission;
}) {
  const { userInput, submissions, fileUrl } = summary;
  const rubricName = userInput?.rubric?.name;
  const firstGraded = formatDate(first?.timestamp ?? summary.timestamp) ?? "—";
  const lastGraded = latest && submissions.length > 1 ? formatDate(latest.timestamp) ?? "—" : null;

  return (
    <PageHeader
      eyebrow="History"
      title={userInput?.title?.trim() || "Untitled"}
      description={
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {rubricName && <Badge variant="outline">{rubricName}</Badge>}
          <span>
            First graded {firstGraded}
            {lastGraded && <> · Last {lastGraded}</>}
          </span>
        </span>
      }
      actions={
        <>
          {fileUrl && (
            <Button asChild variant="outline">
              <a href={fileUrl} target="_blank" rel="noreferrer">
                <Download /> Original
              </a>
            </Button>
          )}
          {latest && (
            <Button asChild>
              <Link href={`/assignments/${summaryID}/${latest.timestamp?.toMillis?.()}`}>
                <PenLine /> Revise latest
              </Link>
            </Button>
          )}
        </>
      }
    />
  );
}

function StatCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Card className="flex items-center justify-between gap-3 p-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </Card>
  );
}

function SummaryStats({ count, first, latest }: { count: number; first?: Submission; latest?: Submission }) {
  return (
    <div className="mb-8 grid gap-3 sm:grid-cols-3">
      <StatCard label="Latest grade">
        <GradePill grade={latest?.grade} className="text-base" />
      </StatCard>
      <StatCard label="Submissions">
        <span className="font-serif text-xl font-semibold tabular-nums">{count}</span>
      </StatCard>
      <StatCard label="First grade">
        <GradePill grade={first?.grade} className="text-base" />
      </StatCard>
    </div>
  );
}

function AssignmentCard({ userInput }: { userInput: UserHistoryType["userInput"] }) {
  const topic = userInput?.topic;
  const rubric = userInput?.rubric ?? null;
  if (!topic && !rubric) return null;

  return (
    <Card className="mb-8 overflow-hidden">
      {topic && (
        <div className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Assignment
          </p>
          <p className="mt-1 text-sm leading-relaxed">{topic}</p>
        </div>
      )}
      {rubric && (
        <details className={topic ? "group border-t border-border" : "group"}>
          <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-3 text-sm font-medium hover:bg-muted/60 [&::-webkit-details-marker]:hidden">
            <ChevronRight
              className="size-4 text-muted-foreground transition-transform group-open:rotate-90"
              aria-hidden
            />
            Rubric: {rubric.name}
          </summary>
          <div className="flex flex-col gap-3 border-t border-border p-5">
            {rubric.description && (
              <p className="text-sm text-muted-foreground">{rubric.description}</p>
            )}
            <RubricDisplay rubric={rubric} />
          </div>
        </details>
      )}
    </Card>
  );
}

function SummaryContent({ summaryID, summary }: { summaryID: string; summary: UserHistoryType }) {
  const { submissions } = summary;
  const latest = submissions[submissions.length - 1];
  const first = submissions[0];

  return (
    <>
      <SummaryHeader summaryID={summaryID} summary={summary} first={first} latest={latest} />
      <SummaryStats count={submissions.length} first={first} latest={latest} />
      <AssignmentCard userInput={summary.userInput} />

      <h2 className="mb-4 font-serif text-xl font-semibold">Submissions</h2>
      {submissions.length === 0 ? (
        <EmptyState title="No submissions yet" />
      ) : (
        <SubmissionTimeline summaryID={summaryID} submissions={submissions} />
      )}
    </>
  );
}

function SummaryLoader({ uid, summaryID }: { uid: string; summaryID: string }) {
  const [state, setState] = useState<
    { status: "loading" } | { status: "ready"; summary: UserHistoryType | null } | { status: "error" }
  >({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchSummary(uid, summaryID)
      .then((summary) => {
        if (!cancelled) setState({ status: "ready", summary });
      })
      .catch((error) => {
        console.error("Error in getSummary", error);
        if (cancelled) return;
        toast.error("Failed to load this grading.");
        setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [uid, summaryID]);

  if (state.status === "loading") return <SummarySkeleton />;

  if (state.status === "error" || !state.summary) {
    return (
      <EmptyState
        icon={<FileQuestion />}
        title={state.status === "error" ? "Couldn't load this grading" : "Grading not found"}
        description="It may have been deleted, or the link is incorrect."
        action={
          <Button asChild variant="outline">
            <Link href="/assignments">Back to history</Link>
          </Button>
        }
      />
    );
  }

  return <SummaryContent summaryID={summaryID} summary={state.summary} />;
}

export default function SummaryPage() {
  const uid = useAuthStore((s) => s.uid);
  const params = useParams();
  const summaryID = (params?.summaryID as string) ?? "";

  return (
    <PageContainer size="narrow">
      {uid && summaryID ? (
        <SummaryLoader key={`${uid}/${summaryID}`} uid={uid} summaryID={summaryID} />
      ) : (
        <SummarySkeleton />
      )}
    </PageContainer>
  );
}
