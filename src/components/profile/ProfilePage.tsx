"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { PageContainer, PageHeader } from "@/components/ui/page-layout";
import useProfileStore from "@/zustand/useProfileStore";
import { usePaymentsStore } from "@/zustand/usePaymentsStore";
import { recordInAppPurchase } from "@/actions/paymentActions";
import AboutYouCard from "./AboutYouCard";
import AccountCard from "./AccountCard";
import BillingCard from "./BillingCard";
import DangerZoneCard from "./DangerZoneCard";

/**
 * Credits purchased through the native wrapper arrive as a postMessage from
 * React Native. Only the wrapper can send them, and the server grants credits.
 */
function useInAppPurchaseListener() {
  const setCredits = useProfileStore((s) => s.setCredits);
  const fetchPayments = usePaymentsStore((s) => s.fetchPayments);

  useEffect(() => {
    if (!window.ReactNativeWebView) return;

    const handleMessageFromRN = async (event: MessageEvent) => {
      const message = event.data;
      if (message?.type !== "IAP_SUCCESS" || typeof message.message !== "string") return;
      try {
        const result = await recordInAppPurchase({
          transactionId: message.message,
          platform: String(message.platform ?? ""),
          productId: String(message.productId ?? ""),
          amount: Number(message.amount) || 0,
          currency: String(message.currency ?? ""),
        });
        if (result.status === "success") {
          setCredits(result.credits);
          toast.success("Purchase complete. Credits added.");
        }
        fetchPayments();
      } catch (error) {
        console.error("Failed to record in-app purchase:", error);
        toast.error("We couldn't add your purchase. Please contact support.");
      }
    };
    window.addEventListener("message", handleMessageFromRN);
    return () => window.removeEventListener("message", handleMessageFromRN);
  }, [setCredits, fetchPayments]);
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
