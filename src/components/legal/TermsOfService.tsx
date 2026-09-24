import { LegalDocument } from "@/components/legal/LegalDocument";
import { TermsUseAndBilling } from "@/components/legal/terms/TermsUseAndBilling";
import { TermsRightsAndLiability } from "@/components/legal/terms/TermsRightsAndLiability";
import { TermsGeneral } from "@/components/legal/terms/TermsGeneral";

export function TermsOfService() {
  return (
    <LegalDocument title="Terms of Service">
      <TermsUseAndBilling />
      <TermsRightsAndLiability />
      <TermsGeneral />
    </LegalDocument>
  );
}
