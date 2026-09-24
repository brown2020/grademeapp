import type { Metadata } from "next";
import PlagiarismCheckDashboard from "@/components/plagiarism/PlagiarismCheckDashboard";

export const metadata: Metadata = { title: "Plagiarism & AI check" };

export default function PlagiarismCheckPage() {
  return <PlagiarismCheckDashboard />;
}
