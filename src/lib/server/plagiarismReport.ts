import { createHash, timingSafeEqual } from "crypto";
import { FieldValue, type DocumentReference, type Transaction } from "firebase-admin/firestore";
import { adminDb } from "@/firebase/firebaseAdmin";
import { profileRef, refundCredits } from "@/lib/server/billing";

const ID = /^[A-Za-z0-9_-]{1,128}$/;

export function isSafeId(value: string): boolean {
  return ID.test(value);
}

export type ReportIds = { uid: string; docId: string };

export type ScanOutcome =
  | { status: "completed"; results: Record<string, unknown> }
  | { status: "error"; message: string };

/** Copyleaks echoes `statusHeaders` on every status callback. Compare digests so length is not a signal. */
export function copyleaksSecretMatches(provided: string | null, secret: string): boolean {
  if (!provided || !secret) return false;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(provided), digest(secret));
}

/**
 * Moves a pending report to its final state exactly once. A failed scan refunds
 * the credits charged at submit, in the same transaction.
 */
export async function settlePlagiarismReport({ uid, docId }: ReportIds, outcome: ScanOutcome) {
  if (!isSafeId(uid) || !isSafeId(docId)) return "invalid" as const;
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

/** Refunds a charge that never produced a report, or settles the report when it did. */
export async function undoFailedScan(charged: { uid: string; amount: number; docId?: string }) {
  if (charged.docId) {
    await settlePlagiarismReport(
      { uid: charged.uid, docId: charged.docId },
      { status: "error", message: "Scan submission failed" }
    );
    return;
  }
  await refundCredits(charged.uid, charged.amount);
}
