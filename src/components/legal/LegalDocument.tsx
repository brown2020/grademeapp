import type { ReactNode } from "react";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { LEGAL } from "@/components/legal/legalInfo";

/** Narrow page shell for long-form legal text. */
export function LegalDocument({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <PageContainer size="narrow">
      <PageHeader
        eyebrow="Legal"
        title={title}
        description={`Last updated ${LEGAL.updatedAt}`}
      />
      <article className="legal-prose break-words">{children}</article>
    </PageContainer>
  );
}
