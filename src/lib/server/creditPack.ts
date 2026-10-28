import {
  Timestamp,
  type DocumentReference,
  type Query,
  type Transaction,
} from "firebase-admin/firestore";
import { adminDb } from "@/firebase/firebaseAdmin";
import { profileRef } from "@/lib/server/billing";
import { CREDIT_PACK } from "@/components/payments/format";

export const PACK_AMOUNT = Math.round(CREDIT_PACK.price * 100);

const UID = /^[A-Za-z0-9]{1,128}$/;

export type PaymentReceipt = { id: string; amount: number; created: number; status: string };

export type CompletedPayment =
  | { status: "success"; receipt: PaymentReceipt; credits: number }
  | { status: "already"; receipt: PaymentReceipt };

export function isCreditPackPayment(amount: number, currency: string): boolean {
  return amount === PACK_AMOUNT && currency === "usd";
}

/**
 * Grants the credit pack once for a payment the caller has already verified.
 * The payment record (keyed by intent id) and the credit write share one transaction.
 */
export async function grantCreditPack(input: {
  uid: string;
  intentId: string;
  amount: number;
  createdMs: number;
  status: string;
}): Promise<CompletedPayment> {
  if (!UID.test(input.uid)) throw new Error("Invalid account.");
  if (!isCreditPackPayment(input.amount, "usd")) throw new Error("Unexpected payment amount.");

  const receipt: PaymentReceipt = {
    id: input.intentId,
    amount: input.amount,
    created: input.createdMs,
    status: input.status,
  };

  const paymentRef: DocumentReference = adminDb.doc(`users/${input.uid}/payments/${input.intentId}`);
  const legacyPayment: Query = adminDb
    .collection(`users/${input.uid}/payments`)
    .where("id", "==", input.intentId)
    .limit(1);

  return adminDb.runTransaction(async (tx: Transaction): Promise<CompletedPayment> => {
    const [existing, legacy, profile] = await Promise.all([
      tx.get(paymentRef),
      tx.get(legacyPayment),
      tx.get(profileRef(input.uid)),
    ]);
    if (existing.exists || !legacy.empty) return { status: "already", receipt };

    const current = Number(profile.data()?.credits ?? 0);
    const credits = (Number.isFinite(current) ? current : 0) + CREDIT_PACK.credits;
    tx.set(paymentRef, {
      id: input.intentId,
      amount: input.amount,
      createdAt: Timestamp.now(),
      status: input.status,
      mode: "stripe",
      platform: "web",
      productId: "payment_gateway",
      currency: "$",
    });
    tx.set(profileRef(input.uid), { credits }, { merge: true });
    return { status: "success", receipt, credits };
  });
}
