import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { PrivacyPolicy } from "@/components/legal/PrivacyPolicy";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy">
      <PrivacyPolicy />
    </LegalDocument>
  );
}
