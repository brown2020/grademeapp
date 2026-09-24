import { Suspense } from "react";
import { PageLoader } from "@/components/ui/spinner";
import PaymentSuccessWrapper from "./PaymentSuccessWrapper";

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<PageLoader label="Loading payment details" />}>
      <PaymentSuccessWrapper />
    </Suspense>
  );
}
