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

const TAG = /<\/?[a-z][^>]*>/i;

/** Visible essay text. Editor HTML is stored as markup; scans and counts use the words. */
export function htmlToPlainText(value: string): string {
  if (!value || !TAG.test(value)) return value;
  const decoded = value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr|blockquote|ul|ol|pre|section)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num: string) => String.fromCodePoint(Number(num)));
  return decoded.replace(/[ \t]+\n/g, "\n").replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

/** Mirrors the credit formula in /api/copyleaks/submit so the UI can show a hint. */
export function estimateScanCredits(text: string): number {
  const wordCount = countWords(text);
  if (!wordCount) return 0;
  const copyleaksCredits = Math.ceil(wordCount / 250);
  const costInDollars = (17 / 100) * copyleaksCredits;
  const gradeMeCost = costInDollars * 1.5;
  return Math.ceil(gradeMeCost / (1 / 200));
}

export function countWords(text: string): number {
  const trimmed = htmlToPlainText(text).trim();
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
  const clean = htmlToPlainText(text ?? "").replace(/\s+/g, " ").trim();
  if (!clean) return "Untitled scan";
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
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
