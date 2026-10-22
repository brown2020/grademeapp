"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { completePayment, type PaymentReceipt } from "@/actions/paymentActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore from "@/zustand/useProfileStore";
import { CREDIT_PACK, formatAmount, formatCredits } from "./format";

type Result =
  | { status: "loading" }
  | { status: "success" | "already"; receipt: PaymentReceipt }
  | { status: "error"; message: string };

type Props = { payment_intent: string };

export default function PaymentSuccess({ payment_intent }: Props) {
  const uid = useAuthStore((s) => s.uid);
  const setCredits = useProfileStore((s) => s.setCredits);
  const [result, setResult] = useState<Result>({ status: "loading" });
  // Avoids a redundant second request under StrictMode; the server grant is idempotent anyway.
  const processedIntent = useRef<string | null>(null);

  useEffect(() => {
    if (!uid || !payment_intent || processedIntent.current === payment_intent) return;
    processedIntent.current = payment_intent;

    completePayment(payment_intent)
      .then((completed) => {
        if (completed.status === "success") setCredits(completed.credits);
        setResult({ status: completed.status, receipt: completed.receipt });
      })
      .catch((error: unknown) => {
        console.warn(
          "Payment completion failed:",
          error instanceof Error ? error.message : String(error)
        );
        setResult({ status: "error", message: "We couldn't apply this payment" });
      });
  }, [uid, payment_intent, setCredits]);

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
                +{formatCredits(CREDIT_PACK.credits)}
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
