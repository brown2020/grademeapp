import { NextRequest, NextResponse } from "next/server";
import { copyleaksSecretMatches, isSafeId, settlePlagiarismReport, type ReportIds } from "@/lib/server/plagiarismReport";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ status: string }> },
) {
  const [routeParams, rawBody] = await Promise.all([params, request.text()]);
  const { status } = routeParams;

  const secret = process.env.COPYLEAKS_WEBHOOK_SECRET;
  if (!secret || !copyleaksSecretMatches(request.headers.get("x-copyleaks-secret"), secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: WebhookBody;
  try {
    body = JSON.parse(rawBody) as WebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (status !== "completed" && status !== "error") {
    console.warn(`Unhandled webhook status: ${status}`);
    return NextResponse.json({ message: "Ignored" }, { status: 200 });
  }

  const ids = reportIds(body);
  if (!ids) {
    return NextResponse.json({ error: "Webhook payload does not identify a report" }, { status: 400 });
  }

  try {
    const outcome =
      status === "completed"
        ? await settlePlagiarismReport(ids, { status: "completed", results: body.results ?? {} })
        : await settlePlagiarismReport(ids, { status: "error", message: body.error?.message || "Scan failed" });
    if (outcome !== "updated") console.warn(`Copyleaks ${status} webhook for ${outcome} report ${ids.docId}`);
    return NextResponse.json({ message: "Webhook processed successfully", outcome }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}

interface WebhookBody {
  developerPayload?: string;
  scannedDocument?: { metadata?: { filename?: string } };
  results?: Record<string, unknown>;
  error?: { message?: string };
}

/** Submissions send `developerPayload: "uid/docId"`; older scans only carry `uid-docId.txt`. */
function reportIds(body: WebhookBody): ReportIds | null {
  const fromPayload = typeof body.developerPayload === "string" ? body.developerPayload.split("/") : [];
  const fromFilename = (body.scannedDocument?.metadata?.filename ?? "").replace(/\.txt$/, "").split("-");
  const parts = fromPayload.length === 2 ? fromPayload : fromFilename;
  const [uid, docId] = parts;
  return parts.length === 2 && uid && docId && isSafeId(uid) && isSafeId(docId) ? { uid, docId } : null;
}
