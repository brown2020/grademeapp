"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/input";
import { SimpleSelect } from "@/components/ui/select";
import {
  DEFAULT_IDENTITY,
  identityOptions,
  levelsFor,
  toOptions,
} from "@/components/profile/identityOptions";
import useProfileStore from "@/zustand/useProfileStore";
import { useAuthStore } from "@/zustand/useAuthStore";

const DISMISSED_KEY = "grademe:identity-prompt-dismissed";

const wasDismissed = () =>
  typeof window !== "undefined" && window.sessionStorage.getItem(DISMISSED_KEY) === "1";

/** Asks newly signed-in users who they are so rubrics can be ranked for them. */
export function IdentityDialog() {
  const uid = useAuthStore((s) => s.uid);
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const [dismissed, setDismissed] = useState(wasDismissed);

  const needsIdentity =
    Boolean(uid && profile.contactEmail) &&
    (!profile.identity || !profile.identityLevel);
  const identity = profile.identity || DEFAULT_IDENTITY;
  const levels = levelsFor(identity);

  const dismiss = () => {
    window.sessionStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  };

  return (
    <Dialog
      open={needsIdentity && !dismissed}
      onOpenChange={(open) => !open && dismiss()}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tell us about you</DialogTitle>
          <DialogDescription>
            We use this to suggest rubrics that fit your level. You can change it
            any time in your profile.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="I am a" htmlFor="identity">
            <SimpleSelect
              id="identity"
              value={profile.identity || undefined}
              placeholder="Select one…"
              options={identityOptions()}
              onChange={(value) =>
                updateProfile({ identity: value, identityLevel: levelsFor(value)[0] ?? "" })
              }
            />
          </Field>
          <Field label="Level" htmlFor="identity-level">
            <SimpleSelect
              id="identity-level"
              value={profile.identityLevel || undefined}
              placeholder="Select level…"
              options={toOptions(levels)}
              onChange={(value) => updateProfile({ identity, identityLevel: value })}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={dismiss}>
            Not now
          </Button>
          <Button onClick={() => setDismissed(true)} disabled={!profile.identityLevel}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
