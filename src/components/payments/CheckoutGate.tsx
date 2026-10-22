"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, PageContainer } from "@/components/ui/page-layout";
import { useIsReactNativeWebView } from "@/lib/utils/platform";

const CheckoutPage = dynamic(() => import("./CheckoutPage"), { ssr: false });

/** Stripe checkout on the web; the native app does not sell credits. */
export default function CheckoutGate() {
  const isWebView = useIsReactNativeWebView();
  if (isWebView === null) return null;
  if (!isWebView) return <CheckoutPage />;

  return (
    <PageContainer size="narrow">
      <EmptyState
        icon={<Coins />}
        title="Purchases aren’t available in the app"
        description="Your credit balance and grading history are the same wherever you sign in."
        action={
          <Button asChild variant="secondary">
            <Link href="/profile">Back to profile</Link>
          </Button>
        }
      />
    </PageContainer>
  );
}
