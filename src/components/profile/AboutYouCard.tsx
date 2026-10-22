"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/input";
import { SimpleSelect } from "@/components/ui/select";
import useProfileStore from "@/zustand/useProfileStore";
import { DEFAULT_IDENTITY, identityOptions, levelsFor, toOptions } from "./identityOptions";

export default function AboutYouCard() {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  const levels = levelsFor(profile.identity);
  // Only show what is actually saved; a pre-filled fallback could never be selected (and saved).
  const level =
    profile.identityLevel && levels.includes(profile.identityLevel) ? profile.identityLevel : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-lg">About you</CardTitle>
        <CardDescription>
          Used to suggest rubrics and pitch feedback at the right level.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Field label="I am a" htmlFor="profile-identity">
          <SimpleSelect
            id="profile-identity"
            value={profile.identity || undefined}
            placeholder="Select one…"
            options={identityOptions()}
            onChange={(value) => {
              if (profile.identity !== value) {
                updateProfile({ identity: value, identityLevel: levelsFor(value)[0] ?? "" });
              }
            }}
          />
        </Field>
        <Field label="Level" htmlFor="profile-identity-level">
          <SimpleSelect
            id="profile-identity-level"
            value={level}
            placeholder="Select level…"
            options={toOptions(levels)}
            onChange={(value) =>
              updateProfile({ identity: profile.identity || DEFAULT_IDENTITY, identityLevel: value })
            }
          />
        </Field>
      </CardContent>
    </Card>
  );
}
