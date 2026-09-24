"use client";

import { AlertCircle, Plus, RefreshCw, ScanSearch } from "lucide-react";
import { useAuthStore } from "@/zustand/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, PageContainer, PageHeader } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/spinner";
import { PlagiarismChecker } from "./PlagiarismChecker";
import { ReportListItem } from "./ReportListItem";
import { useJsonResource, usePolling } from "./useJsonResource";
import { sortNewestFirst, type PlagiarismReportDoc } from "./report";

const POLL_MS = 15_000;

async function parseReports(response: Response): Promise<PlagiarismReportDoc[]> {
  // The list route answers 404 when the user has no reports yet.
  if (response.status === 404) return [];
  if (!response.ok) {
    throw new Error(`Failed to load reports (${response.status})`);
  }
  const data = await response.json();
  return Array.isArray(data) ? sortNewestFirst(data) : [];
}

function ReportsSkeleton() {
  return (
    <Card className="divide-y divide-border" aria-busy>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-6 w-12" />
        </div>
      ))}
    </Card>
  );
}

export default function PlagiarismCheckDashboard() {
  const { uid } = useAuthStore();
  const url = uid ? `/api/copyleaks/reports/${uid}` : null;
  const { data: reports, error, isLoading, isRefreshing, reload } = useJsonResource(
    url,
    parseReports
  );
  usePolling(Boolean(reports?.some((r) => r.status === "pending")), POLL_MS, reload);

  const newScan = (
    <PlagiarismChecker
      onSubmitted={reload}
      trigger={
        <Button>
          <Plus aria-hidden />
          New scan
        </Button>
      }
    />
  );

  return (
    <PageContainer>
      <PageHeader
        title="Plagiarism & AI check"
        description="Scan writing against web sources and for AI-generated passages. Reports update automatically while they run."
        actions={
          <>
            {reports && reports.length > 0 && (
              <Button variant="outline" onClick={reload} loading={isRefreshing}>
                {!isRefreshing && <RefreshCw aria-hidden />}
                Refresh
              </Button>
            )}
            {newScan}
          </>
        }
      />

      {!uid || isLoading ? (
        <ReportsSkeleton />
      ) : error && !reports ? (
        <EmptyState
          icon={<AlertCircle />}
          title="Couldn't load your reports"
          description={error}
          action={
            <Button variant="outline" onClick={reload}>
              Try again
            </Button>
          }
        />
      ) : !reports || reports.length === 0 ? (
        <EmptyState
          icon={<ScanSearch />}
          title="No scans yet"
          description="Run your first scan to check a piece of writing for matching sources and AI content."
          action={newScan}
        />
      ) : (
        <Card className="p-1.5">
          <ul className="divide-y divide-border">
            {reports.map((report) => (
              <ReportListItem key={report.docId} uid={uid} report={report} />
            ))}
          </ul>
        </Card>
      )}
    </PageContainer>
  );
}
