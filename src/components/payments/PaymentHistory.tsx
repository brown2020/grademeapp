"use client";

import { useEffect } from "react";
import { Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/spinner";
import { useAuthStore } from "@/zustand/useAuthStore";
import { usePaymentsStore } from "@/zustand/usePaymentsStore";
import { formatAmount } from "./format";

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

export default function PaymentHistory() {
  const uid = useAuthStore((s) => s.uid);
  const payments = usePaymentsStore((s) => s.payments);
  const paymentsLoading = usePaymentsStore((s) => s.paymentsLoading);
  const paymentsError = usePaymentsStore((s) => s.paymentsError);
  const fetchPayments = usePaymentsStore((s) => s.fetchPayments);

  useEffect(() => {
    if (uid) fetchPayments();
  }, [uid, fetchPayments]);

  return (
    <section aria-labelledby="payment-history-heading" className="flex flex-col gap-2">
      <h3 id="payment-history-heading" className="text-sm font-medium">
        Purchase history
      </h3>
      {paymentsLoading ? (
        <div className="flex flex-col gap-2" aria-hidden>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : paymentsError ? (
        <p className="text-sm text-destructive">Couldn&apos;t load purchases: {paymentsError}</p>
      ) : payments.length === 0 ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Receipt className="size-4" aria-hidden /> No purchases yet.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {payments.map((payment) => (
            <li
              key={payment.id}
              className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm"
            >
              <div className="min-w-0">
                <p className="font-medium tabular-nums">
                  {formatAmount(payment.amount, payment.currency)}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {payment.createdAt ? dateFormatter.format(payment.createdAt.toDate()) : "—"}
                  {payment.mode ? ` · ${payment.mode === "iap" ? "In-app" : "Card"}` : ""}
                </p>
              </div>
              <Badge variant={payment.status === "succeeded" ? "success" : "neutral"}>
                {payment.status === "succeeded" ? "Paid" : payment.status}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
