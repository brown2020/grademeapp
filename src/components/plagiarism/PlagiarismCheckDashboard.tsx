"use client"

import { useState, useEffect } from "react";
import { useAuthStore } from "@/zustand/useAuthStore";

interface Report {
  docId: string;
  status: string;
}

export default function PlagiarismCheckDashboard() {
  const { uid } = useAuthStore();
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    // Fetch all reports for the current user
    async function fetchReports() {
      const response = await fetch(`/api/copyleaks/reports/?uid=${uid}`);
      const data = await response.json();
      setReports(data);
    }
    fetchReports();
  }, [uid]);

  if (!reports.length) return <div>Loading...</div>;

  return (
    <div>
      <h1>Plagiarism Check Dashboard</h1>
      <button onClick={() => window.location.href = "/plagiarism-check/submit"}>
        Start New Check
      </button>
      <ul>
        {reports.map((report) => (
          <li key={report.docId}>
            <a href={`/plagiarism-check/${uid}/${report.docId}`}>
              Document: {report.docId} - Status: {report.status}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
