"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"

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

  console.log("Plagiarism Report Params:", { uid, docId });

  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    async function fetchReport() {
      const response = await fetch(`/api/copyleaks/reports/${uid}/${docId}`);
      const data = await response.json();
      console.log(data);
      setReport(data);
    }
    fetchReport();


  }, [uid, docId]);

  console.log(report);

  if (!report) return <div>Loading...</div>;

  return (
    <div>
      <h1>Plagiarism Report for Document {docId}</h1>
      <p>Status: {report.status}</p>
      <p>Aggregated Score: {report?.results?.score?.aggregatedScore ?? ""}</p>
      <h2>Matched Sources</h2>
      <ul>
        {report?.results?.internet?.map((source) => (
          <li key={source.id}>
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              {source.title} - Words Matched: {source.matchedWords}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
