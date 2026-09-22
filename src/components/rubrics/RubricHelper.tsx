"use client";

import RubricHelperPanel from "./RubricHelperPanel";

import RubricHelperTrigger from "./RubricHelperTrigger";

import { useState, useRef } from "react";
import CustomListbox from "@/components/ui/CustomListbox";
import { Field } from "@headlessui/react";
import TextareaAutosize from "react-textarea-autosize";
import { getVerbsByValue, userInputs } from "@/lib/constants/userInputs";
import { useRubricStore } from "@/zustand/useRubricStore";
import useProfileStore from "@/zustand/useProfileStore";
import { LifeBuoy } from "lucide-react";
import CustomButton from "@/components/ui/CustomButton";
import RubricHelperTour from "@/components/tours/RubricHelperTour";

export default function RubricHelper() {
  const { gradingData, setGradingData } = useRubricStore();
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState(false);
  const rubricHelperRef = useRef<HTMLDivElement>(null);

  const identityLevels = profile?.identity ? userInputs.identity.identityLevels[profile.identity] : userInputs.identity.identityLevels["student"];

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGradingData({ ...gradingData, [name]: value });
  };

  const handleReset = () => {
    // Clear gradingData
    setGradingData({
      assigner: "",
      topic: "",
      prose: "",
      audience: "",
      wordLimitType: "less than",
      wordLimit: "",
      textType: "narrative",
      title: "",
      text: "",
    });
  };

  const closeRubricHelper = () => {
    setIsOpen(false);
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
    }, 300); // Match the duration of your exit animation
  };

  return (
    <div>
      <RubricHelperTrigger isOpen={isOpen} onToggle={isOpen ? closeRubricHelper : () => setIsOpen(true)} />

      <RubricHelperPanel
        rubricHelperRef={rubricHelperRef}
        isOpen={isOpen}
        isExiting={isExiting}
        profile={profile}
        identityLevels={identityLevels}
        gradingData={gradingData}
        setGradingData={setGradingData}
        updateProfile={updateProfile}
        handleInputChange={handleInputChange}
        handleReset={handleReset}
        closeRubricHelper={closeRubricHelper}
      />

    </div>
  );
}
