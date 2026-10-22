import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { FieldValue, type DocumentReference, type Transaction } from "firebase-admin/firestore";
import { adminDb } from "@/firebase/firebaseAdmin";
import { profileRef } from "@/lib/server/billing";

function verifyWebhookSignature(request: NextRequest, rawBody: string): boolean {
  const secret = process.env.COPYLEAKS_WEBHOOK_SECRET;
  if (!secret) {
    // Fail closed when secret is configured expectation; allow local/dev without secret only if explicitly unset and NODE_ENV!==production
    if (process.env.NODE_ENV === "production") return false;
    return true;
  }
  const header =
    request.headers.get("x-copyleaks-signature") ||
    request.headers.get("x-signature") ||
    request.headers.get("copyleaks-signature") ||
    "";
  if (!header) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const provided = header.replace(/^sha256=/i, "").trim();
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(provided, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ status: string }> },
) {
  const [routeParams, rawBody] = await Promise.all([params, request.text()]);
  const { status } = routeParams;

  if (!verifyWebhookSignature(request, rawBody)) {
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
        ? await settleReport(ids, { status: "completed", results: body.results ?? {} })
        : await settleReport(ids, { status: "error", message: body.error?.message || "Scan failed" });
    // 200 for "missing"/"already" too: retrying cannot change the outcome.
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

type ReportIds = { uid: string; docId: string };

/** Submissions send `developerPayload: "uid/docId"`; older scans only carry `uid-docId.txt`. */
function reportIds(body: WebhookBody): ReportIds | null {
  const fromPayload = typeof body.developerPayload === "string" ? body.developerPayload.split("/") : [];
  const fromFilename = (body.scannedDocument?.metadata?.filename ?? "").replace(/\.txt$/, "").split("-");
  const parts = fromPayload.length === 2 ? fromPayload : fromFilename;
  const [uid, docId] = parts;
  return parts.length === 2 && uid && docId ? { uid, docId } : null;
}

type Outcome =
  | { status: "completed"; results: Record<string, unknown> }
  | { status: "error"; message: string };

/**
 * Moves a pending report to its final state exactly once. A failed scan refunds
 * the credits charged at submit, in the same transaction.
 */
async function settleReport({ uid, docId }: ReportIds, outcome: Outcome) {
  const reportRef = adminDb.doc(`users/${uid}/plagiarism_reports/${docId}`) as DocumentReference;
  return adminDb.runTransaction(async (tx: Transaction) => {
    const snap = await tx.get(reportRef);
    if (!snap.exists) return "missing" as const;
    const report = snap.data() ?? {};
    if (report.status !== "pending") return "already" as const;

    const updatedAt = new Date().toISOString();
    if (outcome.status === "completed") {
      tx.update(reportRef, { status: "completed", results: outcome.results, updatedAt });
      return "updated" as const;
    }
    tx.update(reportRef, { status: "error", error: outcome.message, updatedAt });
    const refund = Number(report.creditCost) || 0;
    if (refund > 0) tx.update(profileRef(uid), { credits: FieldValue.increment(refund) });
    return "updated" as const;
  });
}
