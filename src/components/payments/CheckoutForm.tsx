"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { AlertCircle, Lock } from "lucide-react";
import { createPaymentIntent } from "@/actions/paymentActions";
import convertToSubcurrency from "@/lib/utils/convertToSubcurrency";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Spinner } from "@/components/ui/spinner";
import OrderSummary from "./OrderSummary";
import { formatAmount } from "./format";

type Props = { amount: number };

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2 text-sm text-destructive"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

export default function CheckoutForm({ amount }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [attempt, setAttempt] = useState(0);
  const [intent, setIntent] = useState<{ attempt: number; secret?: string; error?: string }>({
    attempt: -1,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    createPaymentIntent(convertToSubcurrency(amount))
      .then((secret) => {
        if (cancelled) return;
        setIntent(
          secret
            ? { attempt, secret }
            : { attempt, error: "Failed to initialize payment. Please try again." }
        );
      })
      .catch((error) => {
        console.error("Failed to initialize payment:", error);
        if (!cancelled) {
          setIntent({ attempt, error: "Failed to initialize payment. Please try again." });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [amount, attempt]);

  const current = intent.attempt === attempt ? intent : null;
  const clientSecret = current?.secret ?? "";
  const initError = current?.error;
  const ready = Boolean(clientSecret && stripe && elements);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setSubmitting(true);
    setErrorMessage(null);
    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message || "Payment failed");
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?amount=${amount}`,
        },
      });

      if (error) setErrorMessage(error.message || "Payment failed");
    } catch (error) {
      setErrorMessage("Payment validation failed. Please try again.");
      console.error("Payment validation error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const total = formatAmount(Math.round(amount * 100), "usd");

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Checkout"
        title="Buy credits"
        description="Top up your balance to keep grading, correcting and checking your writing."
      />
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_20rem] md:items-start">
        <div className="md:order-2">
          <OrderSummary amount={amount} />
        </div>
        <Card className="md:order-1">
          <CardContent className="pt-5">
            {initError ? (
              <div className="flex flex-col items-start gap-4">
                <ErrorNote>{initError}</ErrorNote>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setAttempt((a) => a + 1)}>
                    Try again
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href="/profile">Back to profile</Link>
                  </Button>
                </div>
              </div>
            ) : !ready ? (
              <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
                <Spinner className="size-6" label="Preparing secure checkout" />
                Preparing secure checkout…
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <PaymentElement />
                {errorMessage && <ErrorNote>{errorMessage}</ErrorNote>}
                <Button type="submit" size="lg" disabled={!stripe} loading={submitting}>
                  {!submitting && <Lock />}
                  {submitting ? "Processing…" : `Pay ${total}`}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
