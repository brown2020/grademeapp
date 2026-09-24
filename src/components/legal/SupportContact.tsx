import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { LEGAL } from "@/components/legal/legalInfo";

export function SupportContact() {
  const { companyName, companyEmail, companyAddress, companyLocation, updatedAt } = LEGAL;
  return (
    <PageContainer size="narrow">
      <PageHeader
        eyebrow="Support"
        title="How can we help?"
        description={`Get in touch with the ${companyName} team.`}
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Contact information</CardTitle>
          <CardDescription>
            {companyName} welcomes your questions or comments regarding this application. If
            you have any questions or doubts about the application, please contact{" "}
            {companyName} at:
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Mail className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">Email address</p>
              <a
                href={`mailto:${companyEmail}`}
                className="break-all text-sm text-primary underline-offset-4 hover:underline"
              >
                {companyEmail}
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <MapPin className="size-4" aria-hidden />
            </span>
            <address className="text-sm not-italic text-muted-foreground">
              <span className="block font-medium text-foreground">{companyName}</span>
              <span className="block">{companyAddress}</span>
              <span className="block">{companyLocation}</span>
            </address>
          </div>
        </CardContent>
        <CardFooter className="flex-wrap justify-between">
          <a href={`mailto:${companyEmail}`} className={buttonVariants({ size: "sm" })}>
            <Mail aria-hidden />
            Email us
          </a>
          <div className="flex gap-4 text-sm">
            <Link href="/terms" className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              Privacy
            </Link>
          </div>
        </CardFooter>
      </Card>

      <p className="mt-6 text-sm text-muted-foreground">Last updated: {updatedAt}</p>
    </PageContainer>
  );
}
