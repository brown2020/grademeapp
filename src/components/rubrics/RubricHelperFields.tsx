"use client";

import CustomListbox from "@/components/ui/CustomListbox";
import { Field } from "@headlessui/react";
import TextareaAutosize from "react-textarea-autosize";
import { getVerbsByValue, userInputs } from "@/lib/constants/userInputs";
import type { ChangeEvent } from "react";

type Props = {
  profile: any;
  identityLevels: string[];
  gradingData: any;
  setGradingData: (v: any) => void;
  updateProfile: (v: any) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export default function RubricHelperFields(props: Props) {
  const { profile, identityLevels, gradingData, setGradingData, updateProfile, handleInputChange } = props;
  return (
    <>
        <div className="flex flex-wrap items-center mr-2">
          <span className="mr-2">I am a</span>
          <div className="flex flex-row gap-x-2">
            {/* Identity Level */}
            <CustomListbox
              value={profile?.identityLevel ?? identityLevels[0]}
              options={
                identityLevels.map((level) => ({
                  label: level,
                  value: level,
                }))
              }
              onChange={(value) => {
                if (profile?.identityLevel !== value) {
                  updateProfile({ identityLevel: value });
                }
              }}
              buttonClassName="w-fit rubric-helper-identity-level"
              placeholder="select..."
            />
            {/* Identity Selection */}
            <CustomListbox
              value={profile?.identity ?? "student"} // Default to "student"
              options={userInputs?.identity?.options?.map((identity) => ({
                label: identity,
                value: identity,
              })) ?? []} // Fallback to an empty array
              onChange={(value) => {
                if (profile?.identity !== value) {
                  // Update identity and reset identityLevel to the first in the new array
                  const newIdentityLevels = userInputs?.identity?.identityLevels?.[value] ?? ["3rd grade"];
                  updateProfile({ identity: value, identityLevel: newIdentityLevels[0] });
                }
              }}
              buttonClassName="w-fit rubric-helper-identity"
              placeholder="select..."
            />
          </div>
          <span className="w-fit ml-0.5">.</span>
        </div>

        {/* My [assigner] has asked me to [text_type][verb] [topic] in a(n) [prose] for [audience]. */}

        <div className="flex flex-wrap items-center gap-y-4">
          <hr />
          <div className="flex flex-row flex-wrap items-center">
            <span className="w-fit mr-2">My</span>
            <div className="w-fit mr-2">
              <CustomListbox
                value={gradingData.assigner}
                options={userInputs.assigner.options[profile.identity ?? "student"]?.map((assigner) => ({
                  label: assigner,
                  value: assigner,
                }))}
                onChange={(value) => {
                  if (gradingData.assigner !== value) {
                    setGradingData({ ...gradingData, assigner: value });
                  }
                }}
                buttonClassName="w-[80px] rubric-helper-assigner"
                placeholder="Select..."
              />
            </div>
            <span className="w-fit mr-2">has asked </span>
          </div>

          {/* Text Type */}
          <div className="flex flex-row flex-wrap items-center">
            <span className="w-fit mr-2">me to</span>
            <div className="w-fit mr-2">
              <CustomListbox
                value={gradingData.textType ? getVerbsByValue(gradingData.textType).join(", ") : getVerbsByValue("narrative").join(", ")}
                options={userInputs.textType.map((textType) => ({
                  label: textType.verbs.join(", "),
                  value: textType.value || "",
                }))}
                onChange={(value) => {
                  if (gradingData.textType !== value) {
                    setGradingData({ ...gradingData, textType: value, prose: userInputs.prose.details[value]?.options[0] });
                  }
                }}
                buttonClassName="w-fit rubric-helper-action"
                placeholder="Select..."
              />
            </div>
          </div>

          {/* Topic */}
          <Field className="flex items-center w-full">
            <TextareaAutosize
              id="topic"
              name="topic"
              value={gradingData.topic}
              onChange={handleInputChange}
              minRows={1}
              placeholder="Topic of the assignment"
              className="border rounded-md w-full text-sm px-2 py-1 rubric-helper-assignment-topic"
            />
          </Field>

          <span className="w-fit mx-2">in a(n)</span>

          {/* Prose */}
          {userInputs.prose.details[gradingData.textType ?? "narrative"] && (
            <div className="w-fit mr-2">
              <CustomListbox
                value={gradingData.prose}
                options={userInputs.prose.details[gradingData.textType ?? "narrative"]?.options?.map((prose) => ({
                  label: prose,
                  value: prose,
                }))}
                onChange={(value) => {
                  if (gradingData.prose !== value) {
                    setGradingData({ ...gradingData, prose: value });
                  }
                }}
                buttonClassName="w-fit rubric-helper-text-type"
                placeholder="Select..."
              />
            </div>
          )}

          {/* Audience */}
          <span className="w-fit mr-2">for </span>
          <div className="w-fit mr-2 flex">
            <CustomListbox
              value={gradingData.audience}
              options={userInputs.audience.contextBasedAudiences[profile.identity ?? "student"]?.map((audience) => ({
                label: audience,
                value: audience,
              }))}
              onChange={(value) => {
                if (gradingData.audience !== value) {
                  setGradingData({ ...gradingData, audience: value });
                }
              }}
              buttonClassName="w-fit rubric-helper-audience"
              placeholder="Select..."
            />
          </div>

          <span className="w-fit mr-2">in </span>

          {/* Word Limit */}
          <div className="flex flex-row w-full">
            <div className="flex flex-row gap-x-2 items-center rubric-helper-word-limit">
              <CustomListbox
                value={gradingData.wordLimitType}
                options={userInputs.wordCount.comparisonType.map((option) => ({
                  label: option,
                  value: option,
                }))}
                onChange={(value) => {
                  if (gradingData.wordLimitType !== value) {
                    setGradingData({ ...gradingData, wordLimitType: value });
                  }
                }}
                buttonClassName="w-fit flex "
                placeholder="Select..."
              />

              <input aria-label="Input field"
                type="number"
                name="wordLimit"
                id="wordLimit"
                value={gradingData.wordLimit}
                onChange={(e) => {
                  if (gradingData.wordLimit !== e.target.value) {
                    setGradingData({ ...gradingData, wordLimit: e.target.value });
                  }
                }}
                placeholder={`${gradingData.wordLimitType === "less than" || gradingData.wordLimitType === "more than" ? "500" : gradingData.wordLimitType === "between" ? "500-1000" : "enter a number"} `}
                className="flex h-8 w-28 border text-center placeholder:text-xs md:placeholder:text-sm px-1 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs md:text-lg"
              />
              <span className="w-fit">words.</span>
            </div>
          </div>
        </div>


    </>
  );
}
