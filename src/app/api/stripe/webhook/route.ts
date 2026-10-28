import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { grantCreditPack, isCreditPackPayment } from "@/lib/server/creditPack";

export const maxDuration = 60;

/**
 * Grants the credit pack when Stripe reports a succeeded pack PaymentIntent.
 * Unsigned or unconfigured calls are rejected and never grant credits.
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!webhookSecret || !secretKey) {
    return NextResponse.json({ error: "Stripe webhooks are not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature check failed:", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type !== "payment_intent.succeeded") {
    return NextResponse.json({ received: true });
  }

  const intent = event.data.object;
  const uid = intent.metadata?.uid;
  if (typeof uid !== "string" || !isCreditPackPayment(intent.amount, intent.currency)) {
    console.error("Ignoring Stripe payment that is not the credit pack.", intent.id);
    return NextResponse.json({ received: true, ignored: true });
  }

  try {
    const result = await grantCreditPack({
      uid,
      intentId: intent.id,
      amount: intent.amount,
      createdMs: intent.created * 1000,
      status: intent.status,
    });
    return NextResponse.json({ received: true, status: result.status });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid account.") {
      return NextResponse.json({ received: true, ignored: true });
    }
    console.error("Failed to grant credits for Stripe payment:", error);
    return NextResponse.json({ error: "Failed to record payment." }, { status: 500 });
  }
}
