"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/zustand/useAuthStore";
import { Loader2 } from "lucide-react";

interface Report {
  docId: string;
  status: string;
}

export default function PlagiarismCheckDashboard() {
  const { uid } = useAuthStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;

    async function fetchReports() {
      try {
        const response = await fetch(`/api/copyleaks/reports/${uid}`);
        const data = await response.json();
        setReports(data);
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

    fetchReports();
  }, [uid]);


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
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-500">
        <p className="text-lg font-medium">Error: {error}</p>
      </div>
    );
  }

  if (!reports.length) {
    return (
      <div className="text-center min-h-[50vh]">
        <p className="text-lg text-gray-500">No reports found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Plagiarism Check Dashboard</h1>
      <ul className="space-y-4">
        {reports.map((report) => (
          <li
            key={report.docId}
            className="bg-gray-100 p-4 rounded-md shadow hover:bg-gray-200 transition"
          >
            <a
              href={`/plagiarism-check/${uid}/${report.docId}`}
              className="text-blue-600 hover:underline"
            >
              Document ID: {report.docId}
            </a>
            <p className="text-gray-700 mt-1">Status: {report.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
