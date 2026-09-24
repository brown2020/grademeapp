"use client";

import { useParams } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState, PageContainer, PageHeader } from "@/components/ui/page";
import { Skeleton, Spinner } from "@/components/ui/spinner";
import { MatchedSources } from "./MatchedSources";
import { ScoreCard } from "./ScoreCard";
import { StatusBadge } from "./StatusBadge";
import { useJsonResource, usePolling } from "./useJsonResource";
import {
  formatDate,
  matchedSources,
  similarityPercent,
  similarityTone,
  type PlagiarismReportDoc,
} from "./report";

const POLL_MS = 10_000;

async function parseReport(response: Response): Promise<PlagiarismReportDoc> {
  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "Report not found."
        : "Failed to fetch report. Please try again later."
    );
  }
  return response.json();
}

function ReportSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy>
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

function ScoreBreakdown({ report }: { report: PlagiarismReportDoc }) {
  const score = report.results?.score;
  const rows = [
    ["Identical", score?.identicalWords],
    ["Minor changes", score?.minorChangedWords],
    ["Paraphrased", score?.relatedMeaningWords],
  ].filter((row): row is [string, number] => typeof row[1] === "number");
  if (rows.length === 0) return null;
  return (
    <dl className="flex flex-wrap gap-x-4 gap-y-1">
      {rows.map(([label, value]) => (
        <div key={label} className="flex gap-1">
          <dt>{label}:</dt>
          <dd className="tabular-nums text-foreground">{value.toLocaleString()} words</dd>
        </div>
      ))}
    </dl>
  );
}

function ReportBody({ report }: { report: PlagiarismReportDoc }) {
  if (report.status === "pending") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <Spinner className="size-6" label="Scanning" />
          <p className="font-medium">Scanning your text…</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            This usually takes a minute or two. The page checks for results automatically.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (report.status === "error") {
    return (
      <EmptyState
        icon={<AlertCircle />}
        title="This scan failed"
        description="The checker couldn't finish this scan. Try submitting the text again."
      />
    );
  }

  const similarity = similarityPercent(report);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <ScoreCard
          label="Similarity"
          value={similarity}
          tone={similarity === null ? "primary" : similarityTone(similarity)}
          caption={<ScoreBreakdown report={report} />}
          fallback="No similarity score was returned for this scan."
        />
        <ScoreCard
          label="AI content"
          value={null}
          tone="primary"
          fallback="AI detection results aren't included in this report."
        />
      </div>
      <MatchedSources sources={matchedSources(report)} wordCount={report.wordCount} />
    </div>
  );
}

export default function PlagiarismReport() {
  const params = useParams<{ uid: string; docId: string }>();
  const uid = params?.uid;
  const docId = params?.docId;
  const url = uid && docId ? `/api/copyleaks/reports/${uid}/${docId}` : null;
  const { data: report, error, isLoading, isRefreshing, reload } = useJsonResource(
    url,
    parseReport
  );
  usePolling(report?.status === "pending", POLL_MS, reload);

  const date = formatDate(report?.createdAt);
  const details = [
    date,
    typeof report?.wordCount === "number" ? `${report.wordCount.toLocaleString()} words` : null,
    typeof report?.creditCost === "number" ? `${report.creditCost.toLocaleString()} credits` : null,
  ].filter(Boolean);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Plagiarism & AI check"
        title="Scan report"
        description={details.length > 0 ? details.join(" · ") : undefined}
        actions={
          report && (
            <div className="flex items-center gap-2">
              <StatusBadge status={report.status} />
              <Button variant="outline" size="sm" onClick={reload} loading={isRefreshing}>
                {!isRefreshing && <RefreshCw aria-hidden />}
                Refresh
              </Button>
            </div>
          )
        }
      />

      {isLoading || !url ? (
        <ReportSkeleton />
      ) : error && !report ? (
        <EmptyState
          icon={<AlertCircle />}
          title="Couldn't load this report"
          description={error}
          action={
            <Button variant="outline" onClick={reload}>
              Try again
            </Button>
          }
        />
      ) : report ? (
        <div className="flex flex-col gap-4">
          <ReportBody report={report} />
          {report.text && (
            <Card>
              <details className="group">
                <summary className="cursor-pointer list-none rounded-xl px-5 py-4 text-sm font-medium marker:content-none focus-visible:outline-2 focus-visible:outline-ring">
                  Submitted text
                  <span className="ml-2 text-muted-foreground group-open:hidden">Show</span>
                  <span className="ml-2 hidden text-muted-foreground group-open:inline">Hide</span>
                </summary>
                <div className="scrollbar-thin max-h-96 overflow-y-auto whitespace-pre-wrap break-words border-t border-border px-5 py-4 font-serif leading-relaxed">
                  {report.text}
                </div>
              </details>
            </Card>
          )}
        </div>
      ) : null}
    </PageContainer>
  );
}
