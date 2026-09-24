"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { validatePaymentIntent } from "@/actions/paymentActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/zustand/useAuthStore";
import { usePaymentsStore } from "@/zustand/usePaymentsStore";
import useProfileStore from "@/zustand/useProfileStore";
import { formatAmount, formatCredits } from "./format";

type Receipt = { id: string; amount: number; created: number; status: string };

type Result =
  | { status: "loading" }
  | { status: "success" | "already"; receipt: Receipt }
  | { status: "error"; message: string };

type Props = { payment_intent: string };

export default function PaymentSuccess({ payment_intent }: Props) {
  const uid = useAuthStore((s) => s.uid);
  const addPayment = usePaymentsStore((s) => s.addPayment);
  const checkIfPaymentProcessed = usePaymentsStore((s) => s.checkIfPaymentProcessed);
  const addCredits = useProfileStore((s) => s.addCredits);
  const [result, setResult] = useState<Result>({ status: "loading" });
  // Guards against processing (and crediting) the same intent twice, e.g. under StrictMode.
  const processedIntent = useRef<string | null>(null);

  useEffect(() => {
    if (!uid || !payment_intent || processedIntent.current === payment_intent) return;
    processedIntent.current = payment_intent;

    const handlePaymentSuccess = async () => {
      try {
        const data = await validatePaymentIntent(payment_intent);

        if (data.status !== "succeeded") {
          console.error("Payment validation failed:", data.status);
          setResult({ status: "error", message: "Payment validation failed" });
          return;
        }

        const existingPayment = await checkIfPaymentProcessed(data.id);
        if (existingPayment) {
          setResult({
            status: "already",
            receipt: {
              id: existingPayment.id,
              amount: existingPayment.amount,
              created: existingPayment.createdAt ? existingPayment.createdAt.toMillis() : 0,
              status: existingPayment.status,
            },
          });
          return;
        }

        await addPayment({
          id: data.id,
          amount: data.amount,
          status: data.status,
          mode: "stripe",
          platform: "web",
          productId: "payment_gateway",
          currency: "$",
        });

        const creditsToAdd = data.amount + 1;
        await addCredits(creditsToAdd);

        setResult({
          status: "success",
          receipt: {
            id: data.id,
            amount: data.amount,
            created: data.created * 1000,
            status: data.status,
          },
        });
      } catch (error) {
        console.error("Error handling payment success:", error);
        setResult({ status: "error", message: "Error handling payment success" });
      }
    };

    handlePaymentSuccess();
  }, [uid, payment_intent, addPayment, addCredits, checkIfPaymentProcessed]);

  const view: Result = payment_intent
    ? result
    : { status: "error", message: "No payment intent found" };

  return (
    <PageContainer size="narrow" className="flex justify-center">
      <Card className="w-full max-w-md">
        {view.status === "loading" ? (
          <CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 pt-5 text-sm text-muted-foreground">
            <Spinner className="size-6" label="Confirming your payment" />
            Confirming your payment…
          </CardContent>
        ) : view.status === "error" ? (
          <>
            <CardContent className="flex flex-col items-center gap-3 pt-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-danger-soft text-destructive">
                <AlertCircle className="size-6" aria-hidden />
              </div>
              <h1 className="font-serif text-2xl font-semibold">We couldn&apos;t confirm this payment</h1>
              <p className="text-sm text-muted-foreground">
                {view.message}. If you were charged, contact support with your receipt and
                we&apos;ll sort it out.
              </p>
            </CardContent>
            <CardFooter className="justify-center gap-2">
              <Button asChild variant="outline">
                <Link href="/support">Contact support</Link>
              </Button>
              <Button asChild>
                <Link href="/profile">View account</Link>
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardContent className="flex flex-col items-center gap-3 pt-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-success-soft text-success">
                <CheckCircle2 className="size-6" aria-hidden />
              </div>
              <h1 className="font-serif text-2xl font-semibold">
                {view.status === "success" ? "Thank you!" : "Already processed"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {view.status === "success"
                  ? "Your credits have been added to your account."
                  : "This payment was already applied to your account."}
              </p>
              <p className="mt-2 font-serif text-4xl font-semibold tabular-nums text-primary">
                +{formatCredits(view.receipt.amount + 1)}
              </p>
              <p className="-mt-2 text-sm text-muted-foreground">credits</p>
              <dl className="mt-4 w-full divide-y divide-border rounded-lg border border-border text-left text-sm">
                <div className="flex justify-between gap-4 px-3 py-2">
                  <dt className="text-muted-foreground">Amount</dt>
                  <dd className="tabular-nums">{formatAmount(view.receipt.amount, "usd")}</dd>
                </div>
                <div className="flex justify-between gap-4 px-3 py-2">
                  <dt className="text-muted-foreground">Date</dt>
                  <dd>
                    {view.receipt.created ? new Date(view.receipt.created).toLocaleString() : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 px-3 py-2">
                  <dt className="shrink-0 text-muted-foreground">Reference</dt>
                  <dd className="min-w-0 truncate font-mono text-xs leading-5">{view.receipt.id}</dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button asChild variant="ghost" className="w-full sm:w-auto">
                <Link href="/profile">View account</Link>
              </Button>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/grader">
                  Start grading <ArrowRight />
                </Link>
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </PageContainer>
  );
}
