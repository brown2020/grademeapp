import { Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CREDIT_PACK, formatAmount, formatCredits } from "./format";

export default function OrderSummary({ amount }: { amount: number }) {
  const total = formatAmount(Math.round(amount * 100), "usd");
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="font-serif text-lg">Order summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Coins className="size-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium">{formatCredits(CREDIT_PACK.credits)} credits</p>
            <p className="text-sm text-muted-foreground">One-time purchase</p>
          </div>
          <p className="font-medium tabular-nums">{total}</p>
        </div>
        <div className="flex items-baseline justify-between border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">Total due today</span>
          <span className="font-serif text-2xl font-semibold tabular-nums">{total}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Credits are added to your account as soon as the payment is confirmed. Payments are
          processed securely by Stripe.
        </p>
      </CardContent>
    </Card>
  );
}
