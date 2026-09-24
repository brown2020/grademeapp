"use client";

import { useSyncExternalStore } from "react";
import { Coins, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { isIOSReactNativeWebView } from "@/lib/utils/platform";
import useProfileStore from "@/zustand/useProfileStore";
import PaymentHistory from "@/components/payments/PaymentHistory";
import { CREDIT_PACK, formatCredits } from "@/components/payments/format";
import ApiKeysForm from "./ApiKeysForm";

const noopSubscribe = () => () => {};

function ModeOption({
  checked,
  disabled,
  onSelect,
  icon,
  title,
  description,
}: {
  checked: boolean;
  disabled?: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-ring",
        checked ? "border-primary bg-accent" : "border-border hover:bg-muted/60",
        disabled && "cursor-not-allowed opacity-60 hover:bg-transparent"
      )}
    >
      <input
        type="radio"
        name="billing-mode"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={onSelect}
      />
      <span className={cn("mt-0.5 [&_svg]:size-4", checked ? "text-primary" : "text-muted-foreground")}>
        {icon}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </span>
    </label>
  );
}

export default function BillingCard() {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  // Resolved after mount so SSR and the iOS WebView wrapper render consistently.
  const isWeb = useSyncExternalStore(noopSubscribe, () => !isIOSReactNativeWebView(), () => true);

  const hasSavedKeys = Boolean(profile.fireworks_api_key || profile.openai_api_key);

  const buyCredits = () => {
    if (isWeb) {
      window.location.href = "/payment-attempt";
    } else {
      window.ReactNativeWebView?.postMessage("INIT_IAP");
    }
  };

  const setUseCredits = (useCredits: boolean) => {
    if (profile.useCredits !== useCredits) updateProfile({ useCredits });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-lg">Credits &amp; billing</CardTitle>
        <CardDescription>
          {isWeb
            ? "Buy credits, or bring your own OpenAI / Fireworks API keys."
            : "Buy credits to grade and check your writing."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-xl bg-muted/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Available credits
            </p>
            <p className="font-serif text-4xl font-semibold tabular-nums">
              {formatCredits(profile.credits)}
            </p>
          </div>
          <Button onClick={buyCredits} className="w-full sm:w-auto">
            <Coins /> Buy {formatCredits(CREDIT_PACK.credits)} credits
          </Button>
        </div>

        {isWeb && (
          <>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-medium">Pay for requests with</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                <ModeOption
                  checked={profile.useCredits}
                  onSelect={() => setUseCredits(true)}
                  icon={<Coins />}
                  title="Credits"
                  description="Use your Grade.me credit balance."
                />
                <ModeOption
                  checked={!profile.useCredits}
                  disabled={!hasSavedKeys}
                  onSelect={() => setUseCredits(false)}
                  icon={<KeyRound />}
                  title="My API keys"
                  description={
                    hasSavedKeys ? "Bill your own provider account." : "Save a key below first."
                  }
                />
              </div>
            </fieldset>

            <ApiKeysForm />
          </>
        )}

        <div className="border-t border-border pt-5">
          <PaymentHistory />
        </div>
      </CardContent>
    </Card>
  );
}
