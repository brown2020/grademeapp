import type { Metadata } from "next";
import PlagiarismReport from "@/components/plagiarism/PlagiarismReport";

export const metadata: Metadata = { title: "Scan report" };

export default function PlagiarismReportPage() {
  return <PlagiarismReport />;
}
