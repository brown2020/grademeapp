"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import convertToSubcurrency from "@/lib/utils/convertToSubcurrency";
import CheckoutForm from "./CheckoutForm";
import { CREDIT_PACK } from "./format";
import {
  buildStripeAppearance,
  getColorScheme,
  subscribeColorScheme,
} from "./stripeAppearance";

if (process.env.NEXT_PUBLIC_STRIPE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export default function CheckoutPage() {
  const amount = CREDIT_PACK.price;
  const scheme = useSyncExternalStore(subscribeColorScheme, getColorScheme, () => null);
  const appearance = useMemo(
    () => (scheme ? buildStripeAppearance(scheme) : undefined),
    [scheme]
  );

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: convertToSubcurrency(amount),
        currency: "usd",
        appearance,
      }}
    >
      <CheckoutForm amount={amount} />
    </Elements>
  );
}
