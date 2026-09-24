"use client";

import Image from "next/image";
import { Check, Copy, User2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore from "@/zustand/useProfileStore";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-center sm:gap-4">
      <dt className="w-32 shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 flex-1 text-sm">{children}</dd>
    </div>
  );
}

export default function AccountCard() {
  const profile = useProfileStore((s) => s.profile);
  const uid = useAuthStore((s) => s.uid);
  const authEmail = useAuthStore((s) => s.authEmail);
  const [copied, setCopied] = useState(false);

  const copyUid = async () => {
    try {
      await navigator.clipboard.writeText(uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const name = profile.displayName || "Your account";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-lg">Account</CardTitle>
        <CardDescription>Details from your sign-in provider.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 pb-2">
          {profile.photoUrl ? (
            <Image
              src={profile.photoUrl}
              alt=""
              width={56}
              height={56}
              unoptimized
              className="size-14 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <User2 className="size-6" aria-hidden />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-serif text-xl font-semibold">{name}</p>
            {profile.contactEmail && (
              <p className="truncate text-sm text-muted-foreground">{profile.contactEmail}</p>
            )}
          </div>
        </div>
        <dl className="divide-y divide-border border-t border-border">
          <Row label="Sign-in email">
            <span className="break-all">{authEmail || "—"}</span>
          </Row>
          <Row label="User ID">
            <span className="flex items-center gap-2">
              <code className="min-w-0 truncate rounded-md bg-muted px-2 py-1 font-mono text-xs">
                {uid || "—"}
              </code>
              {uid && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={copyUid}
                  aria-label={copied ? "Copied user ID" : "Copy user ID"}
                >
                  {copied ? <Check className="text-success" /> : <Copy />}
                </Button>
              )}
            </span>
          </Row>
        </dl>
      </CardContent>
    </Card>
  );
}
