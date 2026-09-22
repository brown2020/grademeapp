"use client";

import RubricHelperFields from "./RubricHelperFields";

import CustomListbox from "@/components/ui/CustomListbox";
import { Field } from "@headlessui/react";
import TextareaAutosize from "react-textarea-autosize";
import { getVerbsByValue, userInputs } from "@/lib/constants/userInputs";
import { LifeBuoy } from "lucide-react";
import CustomButton from "@/components/ui/CustomButton";
import RubricHelperTour from "@/components/tours/RubricHelperTour";
import type { RefObject, ChangeEvent } from "react";

type Props = {
  rubricHelperRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  isExiting: boolean;
  profile: any;
  identityLevels: string[];
  gradingData: any;
  setGradingData: (v: any) => void;
  updateProfile: (v: any) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleReset: () => void;
  closeRubricHelper: () => void;
};

export default function RubricHelperPanel({
  rubricHelperRef,
  isOpen,
  isExiting,
  profile,
  identityLevels,
  gradingData,
  setGradingData,
  updateProfile,
  handleInputChange,
  handleReset,
  closeRubricHelper,
}: Props) {
  return (
      <div
        ref={rubricHelperRef}
        className={` flex flex-col gap-y-4 bg-background border-primary-40 border-t-2 border-l-2 border-b-2 p-2 rounded-l-lg fixed right-0 top-[16svh] h-fit max-w-sm w-full z-10 transition-all ${isOpen ? 'animate-enter rubric-helper-open' : isExiting ? 'animate-exit' : 'hidden'}`}
      >
        <RubricHelperTour />
        <div className="flex flex-row gap-x-2 items-center justify-center mb-2">
          <LifeBuoy className="text-primary-40" />
          <h2 className="text-xl font-medium">Rubric Helper</h2>
        </div>
        <RubricHelperFields
          profile={profile}
          identityLevels={identityLevels}
          gradingData={gradingData}
          setGradingData={setGradingData}
          updateProfile={updateProfile}
          handleInputChange={handleInputChange}
        />
        <div className="flex flex-row gap-x-4 justify-start mt-4">
          {/* Done button to close form */}
          <button type="button" onClick={closeRubricHelper} className="btn btn-shiny btn-shiny-green rubric-helper-done">
            Done
          </button>
          {/* Reset the form */}
          <button type="button" onClick={handleReset} className="btn btn-shiny btn-shiny-red rubric-helper-reset">
            Reset
          </button>
        </div>
      </div>
  );
}
