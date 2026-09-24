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
import { userInputs } from "@/lib/constants/userInputs";
import useProfileStore from "@/zustand/useProfileStore";
import { useAuthStore } from "@/zustand/useAuthStore";

const toOptions = (values: string[]) => values.map((v) => ({ label: v, value: v }));

/** Asks newly signed-in users who they are so rubrics can be ranked for them. */
export function IdentityDialog() {
  const uid = useAuthStore((s) => s.uid);
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const [dismissed, setDismissed] = useState(false);

  const needsIdentity =
    Boolean(uid && profile.contactEmail) &&
    (!profile.identity || !profile.identityLevel);
  const identity = profile.identity || "student";
  const levels = userInputs.identity.identityLevels[identity] ?? [];

  return (
    <Dialog
      open={needsIdentity && !dismissed}
      onOpenChange={(open) => !open && setDismissed(true)}
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
              value={identity}
              options={toOptions(userInputs.identity.options)}
              onChange={(value) => {
                const nextLevels = userInputs.identity.identityLevels[value] ?? [];
                updateProfile({ identity: value, identityLevel: nextLevels[0] ?? "" });
              }}
            />
          </Field>
          <Field label="Level" htmlFor="identity-level">
            <SimpleSelect
              id="identity-level"
              value={profile.identityLevel || undefined}
              placeholder="Select level"
              options={toOptions(levels)}
              onChange={(value) => updateProfile({ identity, identityLevel: value })}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button onClick={() => setDismissed(true)}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
