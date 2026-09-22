"use client";

import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

interface Report {
  status: string;
  results: {
    score: {
      aggregatedScore: number;
    };
    internet: {
      id: string;
      url: string;
      title: string;
      matchedWords: number;
    }[];
  };
}

export default function PlagiarismReport() {
  const params = useParams();
  const uid = params?.uid as string;
  const docId = params?.docId as string;
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/copyleaks/reports/${uid}/${docId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch report. Please try again later.");
      }
      const data = await response.json();
      setReport(data);
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
  }, [uid, docId]);

  if (!hasLoaded && !isLoading && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-lg text-gray-500">Plagiarism report</p>
        <button type="button" className="btn btn-shiny btn-shiny-blue px-4 py-2" onClick={loadReport}>
          Load report
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-4 text-lg text-gray-500">Loading report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 p-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="text-red-500">{error}</p>
        <button type="button" className="btn btn-shiny" onClick={loadReport}>Retry</button>
      </div>
    );
  }

  if (!report) {
    return <p className="p-4">No report data.</p>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Plagiarism Report</h1>
      <p>Status: {report.status}</p>
      <p>Score: {report.results?.score?.aggregatedScore ?? "N/A"}</p>
      <ul className="space-y-2">
        {(report.results?.internet ?? []).map((item) => (
          <li key={item.id} className="border rounded p-2">
            <a href={item.url} className="underline" target="_blank" rel="noreferrer">
              {item.title || item.url}
            </a>
            <span className="ml-2 text-sm text-gray-600">{item.matchedWords} matched words</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
