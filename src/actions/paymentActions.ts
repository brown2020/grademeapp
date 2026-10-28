// paymentActions.ts
"use server";

import Stripe from "stripe";
import { z } from "zod";
import {
  requireServerUser,
  UnauthorizedError,
} from "@/lib/server/requestAuth";
import {
  grantCreditPack,
  isCreditPackPayment,
  PACK_AMOUNT,
  type CompletedPayment,
  type PaymentReceipt,
} from "@/lib/server/creditPack";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export type { CompletedPayment, PaymentReceipt };

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
  if (!isCreditPackPayment(intent.amount, intent.currency)) {
    throw new Error("Unexpected payment amount.");
  }

  return grantCreditPack({
    uid,
    intentId: intent.id,
    amount: intent.amount,
    createdMs: intent.created * 1000,
    status: intent.status,
  });
}

const InAppPurchaseSchema = z.object({
  transactionId: z.string().regex(/^[\w.:-]{1,200}$/),
  platform: z.string().max(40).default(""),
  productId: z.string().max(200).default(""),
  amount: z.number().finite().nonnegative().default(0),
  currency: z.string().max(10).default(""),
});

export type InAppPurchaseResult = { status: "success"; credits: number } | { status: "already" };

/**
 * Store purchases are not credited. App Store / Play receipt verification is
 * not configured, and a client-supplied transaction id is not proof of payment.
 */
export async function recordInAppPurchase(input: unknown): Promise<InAppPurchaseResult> {
  await requireUser();
  InAppPurchaseSchema.parse(input);
  throw new Error("In-app purchases require a verified store receipt.");
}
