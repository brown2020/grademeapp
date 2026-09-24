"use client";

import { useEffect } from "react";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { usePaymentsStore } from "@/zustand/usePaymentsStore";
import useProfileStore from "@/zustand/useProfileStore";
import { CREDIT_PACK } from "@/components/payments/format";
import AboutYouCard from "./AboutYouCard";
import AccountCard from "./AccountCard";
import BillingCard from "./BillingCard";
import DangerZoneCard from "./DangerZoneCard";

/** Credits purchased through the native wrapper arrive as a postMessage from React Native. */
function useInAppPurchaseListener() {
  const addCredits = useProfileStore((s) => s.addCredits);
  const addPayment = usePaymentsStore((s) => s.addPayment);

  useEffect(() => {
    const handleMessageFromRN = async (event: MessageEvent) => {
      const message = event.data;
      if (message?.type !== "IAP_SUCCESS") return;
      await addPayment({
        id: message.message,
        amount: message.amount,
        status: "succeeded",
        mode: "iap",
        platform: message.platform,
        productId: message.productId,
        currency: message.currency,
      });
      await addCredits(CREDIT_PACK.credits);
    };
    window.addEventListener("message", handleMessageFromRN);
    return () => window.removeEventListener("message", handleMessageFromRN);
  }, [addCredits, addPayment]);
}

export default function ProfilePage() {
  useInAppPurchaseListener();

  return (
    <PageContainer size="narrow">
      <PageHeader title="Profile" description="Your account, preferences and billing." />
      <div className="flex flex-col gap-6">
        <AccountCard />
        <AboutYouCard />
        <BillingCard />
        <DangerZoneCard />
      </div>
    </PageContainer>
  );
}
