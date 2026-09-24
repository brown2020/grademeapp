"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/input";
import { SimpleSelect } from "@/components/ui/select";
import { userInputs } from "@/lib/constants/userInputs";
import useProfileStore from "@/zustand/useProfileStore";

const FALLBACK_LEVELS = ["3rd grade"];

const levelsFor = (identity: string) =>
  userInputs?.identity?.identityLevels?.[identity] ?? FALLBACK_LEVELS;

const toOptions = (values: string[]) =>
  values.map((v) => ({ label: v.charAt(0).toUpperCase() + v.slice(1), value: v }));

export default function AboutYouCard() {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  const identity = profile.identity || "student";
  const levels = levelsFor(identity);

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
            value={identity}
            options={toOptions(userInputs?.identity?.options ?? [])}
            onChange={(value) => {
              if (profile.identity !== value) {
                updateProfile({ identity: value, identityLevel: levelsFor(value)[0] });
              }
            }}
          />
        </Field>
        <Field label="Level" htmlFor="profile-identity-level">
          <SimpleSelect
            id="profile-identity-level"
            value={
              profile.identityLevel && levels.includes(profile.identityLevel)
                ? profile.identityLevel
                : levels[0]
            }
            options={toOptions(levels)}
            onChange={(value) => {
              if (profile.identityLevel !== value) updateProfile({ identityLevel: value });
            }}
          />
        </Field>
      </CardContent>
    </Card>
  );
}
