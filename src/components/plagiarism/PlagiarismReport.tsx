"use client";

import { useEffect, useState } from "react";
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
  const { uid, docId } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const response = await fetch(`/api/copyleaks/reports/${uid}/${docId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch report. Please try again later.");
        }
        const data = await response.json();
        setReport(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchReport();
  }, [uid, docId]);

  console.log("report", report);

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
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-500">
        <AlertCircle className="h-10 w-10 mb-4" />
        <p className="text-lg font-medium">Error: {error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-lg text-gray-500">No report available.</p>
      </div>
    );
  }

  const { status, results } = report;
  const aggregatedScore = results?.score?.aggregatedScore ?? 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Plagiarism Report</h1>
      <div className="bg-primary-99 shadow p-6 rounded-md mb-6">
        <p className="text-lg">
          <span className="font-medium">Document ID:</span> {docId}
        </p>
        <p className="text-lg">
          <span className="font-medium">Status:</span> {status}
        </p>
        <p className="text-lg mt-2">
          <span className="font-medium">Aggregated Score:</span>{" "}
          <span
            className={`${aggregatedScore > 50 ? "text-red-500" : "text-green-500"
              } font-bold`}
          >
            {aggregatedScore}%
          </span>
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-4">Matched Sources</h2>
      {results?.internet?.length ? (
        <ul className="space-y-4">
          {results.internet.map((source) => (
            <li
              key={source.id}
              className="bg-secondary-98 p-4 rounded-md shadow hover:bg-secondary-95 transition"
            >
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-40 hover:underline"
              >
                <p className="font-medium text-lg">{source.title}</p>
              </a>
              <p className="text-gray-700 mt-1">
                Words Matched: <span className="font-bold">{source.matchedWords}</span>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No matched sources found.</p>
      )}
    </div>
  );
}
