// paymentActions.ts
"use server";

import Stripe from "stripe";
import {
  Timestamp,
  type DocumentReference,
  type Query,
  type Transaction,
} from "firebase-admin/firestore";
import { adminDb } from "@/firebase/firebaseAdmin";
import { profileRef } from "@/lib/server/billing";
import {
  requireServerUser,
  UnauthorizedError,
} from "@/lib/server/requestAuth";
import { CREDIT_PACK } from "@/components/payments/format";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const PACK_AMOUNT = Math.round(CREDIT_PACK.price * 100);

async function requireUser() {
  try {
    return await requireServerUser();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new Error("Authentication required.");
    }
    throw error;
  }
}

/** Creates an intent for the credit pack. The amount is set here, never by the client. */
export async function createPaymentIntent() {
  const { uid } = await requireUser();
  const product = process.env.NEXT_PUBLIC_STRIPE_PRODUCT_NAME;

  try {
    if (!product) throw new Error("Stripe product name is not defined");

    const paymentIntent = await stripe.paymentIntents.create({
      amount: PACK_AMOUNT,
      currency: "usd",
      metadata: { product, uid },
      description: `Payment for product ${product}`,
    });

    return paymentIntent.client_secret;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw new Error("Failed to create payment intent");
  }
}

export type PaymentReceipt = { id: string; amount: number; created: number; status: string };

export type CompletedPayment =
  | { status: "success"; receipt: PaymentReceipt; credits: number }
  | { status: "already"; receipt: PaymentReceipt };

/**
 * Verifies a succeeded intent belongs to the caller and grants the pack's credits
 * exactly once. The payment record (keyed by intent id) and the credit increment
 * are written in one transaction, so reloads and retries never double-credit.
 */
export async function completePayment(paymentIntentId: string): Promise<CompletedPayment> {
  const { uid } = await requireUser();
  if (typeof paymentIntentId !== "string" || !/^pi_[A-Za-z0-9_]+$/.test(paymentIntentId)) {
    throw new Error("Invalid payment reference.");
  }

  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (intent.status !== "succeeded") throw new Error("Payment was not successful");
  if (intent.metadata?.uid !== uid) throw new Error("This payment belongs to a different account.");
  if (intent.amount !== PACK_AMOUNT || intent.currency !== "usd") {
    throw new Error("Unexpected payment amount.");
  }

  const receipt: PaymentReceipt = {
    id: intent.id,
    amount: intent.amount,
    created: intent.created * 1000,
    status: intent.status,
  };

  const paymentRef: DocumentReference = adminDb.doc(`users/${uid}/payments/${intent.id}`);
  // Payments recorded before intent-id keys used auto ids with an `id` field.
  const legacyPayment: Query = adminDb
    .collection(`users/${uid}/payments`)
    .where("id", "==", intent.id)
    .limit(1);

  return adminDb.runTransaction(async (tx: Transaction): Promise<CompletedPayment> => {
    const [existing, legacy, profile] = await Promise.all([
      tx.get(paymentRef),
      tx.get(legacyPayment),
      tx.get(profileRef(uid)),
    ]);
    if (existing.exists || !legacy.empty) return { status: "already", receipt };

    const current = Number(profile.data()?.credits ?? 0);
    const credits = (Number.isFinite(current) ? current : 0) + CREDIT_PACK.credits;
    tx.set(paymentRef, {
      id: intent.id,
      amount: intent.amount,
      createdAt: Timestamp.now(),
      status: intent.status,
      mode: "stripe",
      platform: "web",
      productId: "payment_gateway",
      currency: "$",
    });
    tx.set(profileRef(uid), { credits }, { merge: true });
    return { status: "success", receipt, credits };
  });
}
