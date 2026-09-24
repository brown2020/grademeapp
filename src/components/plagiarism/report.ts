export type ReportStatus = "pending" | "completed" | "error";

export interface MatchedSource {
  id: string;
  url?: string;
  title?: string;
  introduction?: string;
  matchedWords?: number;
}

export interface CopyleaksResults {
  score?: {
    aggregatedScore?: number;
    identicalWords?: number;
    minorChangedWords?: number;
    relatedMeaningWords?: number;
  };
  internet?: MatchedSource[];
  database?: MatchedSource[];
}

/** A document in `users/{uid}/plagiarism_reports`, as returned by /api/copyleaks/reports. */
export interface PlagiarismReportDoc {
  docId?: string;
  status: ReportStatus | string;
  text?: string;
  wordCount?: number;
  creditCost?: number;
  createdAt?: string;
  updatedAt?: string;
  results?: CopyleaksResults;
}

/** Mirrors the credit formula in /api/copyleaks/submit so the UI can show a hint. */
export function estimateScanCredits(text: string): number {
  if (!text.trim()) return 0;
  const wordCount = Number(text.split(/\s+/).length);
  const copyleaksCredits = Math.ceil(wordCount / 250);
  const costInDollars = (17 / 100) * copyleaksCredits;
  const gradeMeCost = costInDollars * 1.5;
  return Math.ceil(gradeMeCost / (1 / 200));
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function similarityPercent(report: PlagiarismReportDoc): number | null {
  const score = report.results?.score?.aggregatedScore;
  return typeof score === "number" && Number.isFinite(score) ? clampPercent(score) : null;
}

export function sourcePercent(source: MatchedSource, wordCount?: number): number | null {
  if (!wordCount || typeof source.matchedWords !== "number") return null;
  return clampPercent((source.matchedWords / wordCount) * 100);
}

export function matchedSources(report: PlagiarismReportDoc): MatchedSource[] {
  const { internet = [], database = [] } = report.results ?? {};
  return [...internet, ...database].sort(
    (a, b) => (b.matchedWords ?? 0) - (a.matchedWords ?? 0)
  );
}

export function excerpt(text: string | undefined, max = 90): string {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (!clean) return "Untitled scan";
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}

export function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function sortNewestFirst(reports: PlagiarismReportDoc[]): PlagiarismReportDoc[] {
  return [...reports].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

/** Low / moderate / high tone used for meters and badges. */
export function similarityTone(percent: number): "success" | "warning" | "danger" {
  if (percent < 15) return "success";
  if (percent < 40) return "warning";
  return "danger";
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value * 10) / 10));
}
