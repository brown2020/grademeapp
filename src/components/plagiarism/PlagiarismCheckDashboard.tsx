"use client";

import { useCallback, useState } from "react";
import { useAuthStore } from "@/zustand/useAuthStore";
import { Loader2 } from "lucide-react";

interface Report {
  docId: string;
  status: string;
}

export default function PlagiarismCheckDashboard() {
  const { uid } = useAuthStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadReports = useCallback(async () => {
    if (!uid) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/copyleaks/reports/${uid}`);
      if (!response.ok) {
        throw new Error(`Failed to load reports (${response.status})`);
      }
      const data = await response.json();
      setReports(Array.isArray(data) ? data : []);
      setHasLoaded(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [uid]);

  if (!uid) {
    return <p className="p-4 text-gray-500">Sign in to view plagiarism reports.</p>;
  }

  if (!hasLoaded && !isLoading && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-lg text-gray-500">Plagiarism reports</p>
        <button type="button" className="btn btn-shiny btn-shiny-blue px-4 py-2" onClick={loadReports}>
          Load reports
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-4 text-lg text-gray-500">Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 p-4">
        <p className="text-red-500">{error}</p>
        <button type="button" className="btn btn-shiny" onClick={loadReports}>Retry</button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Plagiarism Reports</h1>
        <button type="button" className="btn btn-shiny" onClick={loadReports}>Refresh</button>
      </div>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <ul className="space-y-2">
          {reports.map((report) => (
            <li key={report.docId} className="border rounded p-2 flex justify-between">
              <span>{report.docId}</span>
              <span>{report.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
