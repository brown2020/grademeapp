"use client";

import { PageContainer, PageHeader } from "@/components/ui/page-layout";
import AboutYouCard from "./AboutYouCard";
import AccountCard from "./AccountCard";
import BillingCard from "./BillingCard";
import DangerZoneCard from "./DangerZoneCard";

export default function ProfilePage() {
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
