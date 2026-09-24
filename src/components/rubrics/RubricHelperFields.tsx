"use client";

import { Field, Input } from "@/components/ui/input";
import { SimpleSelect } from "@/components/ui/select";
import { userInputs } from "@/lib/constants/userInputs";
import type { GradingData } from "@/lib/types/grading-data";
import type { ProfileType } from "@/zustand/useProfileStore";

type Props = {
  profile: ProfileType;
  gradingData: GradingData;
  setGradingData: (data: Partial<GradingData>) => void;
  updateProfile: (data: Partial<ProfileType>) => void;
};

const toOptions = (values: readonly string[] | undefined) =>
  (values ?? []).filter(Boolean).map((v) => ({ label: capitalize(v), value: v }));

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** userInputs keys a few identity-scoped lists by camelCase ("creativeWriter"). */
function byIdentity<T>(record: Record<string, T>, identity: string): T | undefined {
  const camel = identity.replace(/\s+(\w)/g, (_, c: string) => c.toUpperCase());
  return record[identity] ?? record[camel];
}

const WORD_LIMIT_PLACEHOLDER: Record<GradingData["wordLimitType"], string> = {
  "less than": "500",
  "more than": "500",
  between: "500-1000",
};

export default function RubricHelperFields({ profile, gradingData, setGradingData, updateProfile }: Props) {
  const identity = profile.identity || "student";
  const identityLevels = byIdentity(userInputs.identity.identityLevels, identity) ?? [];
  const textType = gradingData.textType || "narrative";
  const proseOptions = userInputs.prose.details[textType]?.options;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="I am a" htmlFor="helper-identity">
        <SimpleSelect
          id="helper-identity"
          value={identity}
          options={toOptions(userInputs.identity.options)}
          onChange={(value) => {
            if (value === profile.identity) return;
            const levels = byIdentity(userInputs.identity.identityLevels, value) ?? [];
            updateProfile({ identity: value, identityLevel: levels[0] ?? "" });
          }}
        />
      </Field>

      <Field label="Level" htmlFor="helper-level">
        <SimpleSelect
          id="helper-level"
          value={profile.identityLevel || identityLevels[0]}
          options={toOptions(identityLevels)}
          onChange={(value) => value !== profile.identityLevel && updateProfile({ identityLevel: value })}
        />
      </Field>

      <Field label="Assigned by" htmlFor="helper-assigner">
        <SimpleSelect
          id="helper-assigner"
          value={gradingData.assigner}
          options={toOptions(byIdentity(userInputs.assigner.options, identity))}
          onChange={(assigner) => setGradingData({ assigner })}
        />
      </Field>

      <Field label="Type of writing" htmlFor="helper-text-type">
        <SimpleSelect
          id="helper-text-type"
          value={textType}
          options={userInputs.textType.map((t) => ({
            label: `${capitalize(t.value)} (${t.verbs[0]})`,
            value: t.value,
          }))}
          onChange={(value) =>
            setGradingData({
              textType: value,
              prose: userInputs.prose.details[value]?.options[0] ?? "",
            })
          }
        />
      </Field>

      <Field label="Topic" htmlFor="helper-topic" className="sm:col-span-2">
        <Input
          id="helper-topic"
          value={gradingData.topic}
          onChange={(e) => setGradingData({ topic: e.target.value })}
          placeholder="What is the assignment about?"
        />
      </Field>

      {proseOptions && proseOptions.length > 0 && (
        <Field label="Form" htmlFor="helper-prose">
          <SimpleSelect
            id="helper-prose"
            value={gradingData.prose}
            options={toOptions(proseOptions)}
            onChange={(prose) => setGradingData({ prose })}
          />
        </Field>
      )}

      <Field label="Audience" htmlFor="helper-audience">
        <SimpleSelect
          id="helper-audience"
          value={gradingData.audience}
          options={toOptions(byIdentity(userInputs.audience.contextBasedAudiences, identity))}
          onChange={(audience) => setGradingData({ audience })}
        />
      </Field>

      <Field label="Length" htmlFor="helper-word-limit-type" className="sm:col-span-2">
        <div className="flex items-center gap-2">
          <SimpleSelect
            id="helper-word-limit-type"
            className="w-36 shrink-0"
            value={gradingData.wordLimitType}
            options={toOptions(userInputs.wordCount.comparisonType)}
            onChange={(value) => setGradingData({ wordLimitType: value as GradingData["wordLimitType"] })}
          />
          <Input
            aria-label="Word limit"
            inputMode={gradingData.wordLimitType === "between" ? "text" : "numeric"}
            value={gradingData.wordLimit}
            onChange={(e) => setGradingData({ wordLimit: e.target.value })}
            placeholder={WORD_LIMIT_PLACEHOLDER[gradingData.wordLimitType] ?? "500"}
            className="min-w-0"
          />
          <span className="shrink-0 text-sm text-muted-foreground">words</span>
        </div>
      </Field>
    </div>
  );
}
