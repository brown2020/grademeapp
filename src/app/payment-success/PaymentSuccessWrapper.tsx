"use client";

import { useSearchParams } from "next/navigation";
import PaymentSuccess from "@/components/payments/PaymentSuccess";

export default function PaymentSuccessWrapper() {
  const searchParams = useSearchParams();
  const payment_intent = searchParams?.get("payment_intent") ?? "";

  return <PaymentSuccess payment_intent={payment_intent} />;
}
