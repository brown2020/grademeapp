"use client"

import { useState } from "react";
import { RubricState } from "@/types/rubrics-types"; // Adjust the import path as necessary
import { collection, getDocs, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useRubricStore } from "@/zustand/useRubricStore";
import { Switch } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { Info, Blocks } from "lucide-react";

import RubricDisplay from "@/components/rubrics/RubricDisplay";
import RubricBuilder from "@/components/rubrics/RubricBuilder";
import RubricSearch from "@/components/rubrics/RubricSearch";
import RubricHelper from "@/components/rubrics/RubricHelper";
import CustomButton from "@/components/ui/CustomButton";

export default function Rubrics() {
  const { uid } = useAuthStore();
  const {
    rubricOptions,
    setRubricOptions,
    selectedRubric,
    setSelectedRubric,
    useCustomRubrics,
    setUseCustomRubrics,
    resetToDefaultRubrics,
  } = useRubricStore();
  const [showRubricBuilder, setShowRubricBuilder] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const openRubricBuilder = () => {
    setShowRubricBuilder(true);
  };

  // Fetch default rubrics or custom rubrics based on toggle
  const handleCustomRubrics = async () => {
    const newUseCustomRubrics = !useCustomRubrics;
    setUseCustomRubrics(newUseCustomRubrics);

    if (newUseCustomRubrics && uid) {
      // If switching to custom rubrics and user is logged in, fetch custom rubrics
      const fetchCustomRubrics = async () => {
        try {
          const customRubricCollection = collection(db, "users", uid, "custom_rubrics");
          const customRubricSnapshot = await getDocs(customRubricCollection);
          const fetchedRubrics = customRubricSnapshot.docs.map((doc) => doc.data() as RubricState);
          setRubricOptions(fetchedRubrics);

          // Set the first custom rubric as the selected one, if available
          if (fetchedRubrics.length > 0) {
            setSelectedRubric(fetchedRubrics[0]);
          } else {
            setSelectedRubric(null);
          }
        } catch (error) {
          toast.error("Failed to fetch custom rubrics.");
          console.error("Error fetching custom rubrics:", error);
        }
      };
      await fetchCustomRubrics();
    } else {
      // Reset to default rubrics when toggling off custom rubrics
      resetToDefaultRubrics();
    }
  };

  const closeRubricBuilder = () => {
    setTimeout(() => {
      setShowRubricBuilder(false);
      setIsExiting(true);
    }, 300);

    setIsExiting(false);

  };

  return (
    <div className="space-y-3">
      <div>
        <div className="flex flex-row justify-between">
          <h1>Rubrics</h1>
          {/* Use Custom Rubrics Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={useCustomRubrics}
              onChange={() => handleCustomRubrics()}
              className={`${useCustomRubrics ? "bg-primary" : "bg-gray-300"} transition duration-300 ease-in-out relative inline-flex items-center h-6 rounded-full w-11`}
            >
              <span className="sr-only">Use Custom Rubrics</span>
              <span
                className={`${useCustomRubrics ? "translate-x-6" : "translate-x-1"} transition duration-300 ease-in-out inline-block w-4 h-4 transform bg-white rounded-full`}
              />
            </Switch>
            <label className="text-xs w-[120px]">{useCustomRubrics ? "Using Custom Rubrics" : "Using Default Rubrics"}</label>
          </div>
        </div>
        <hr />
      </div>
      {/* Rubric Display */}
      <div className="flex flex-col w-full p-2 text-sm border border-primary-40 rounded-lg bg-primary-98">
        <div className="flex flex-row gap-2 mb-2 relative items-center justify-center text-primary-10">
          <Info onClick={() => setShowTooltip(!showTooltip)} size={18} className="cursor-pointer text-primary-20" />
          <span className={`absolute bottom-full z-50 text-wrap px-2 py-1 bg-primary-90 border border-primary-40 text-xs rounded transition-opacity ${showTooltip ? 'opacity-100 flex' : 'opacity-0 hidden'}`}>
            {selectedRubric?.description}
          </span>
          <h2 className="text-primary-20 font-semibold">{selectedRubric ? selectedRubric.name : "Select a rubric..."}</h2>
        </div>
        <p className="sm:relative text-sm max-w-xs truncate mb-1 hidden">{selectedRubric ? selectedRubric.description : "..."}</p>

        {selectedRubric ? (
          <RubricDisplay rubric={selectedRubric} />
        ) : (
          <div className="flex items-center justify-center h-24">No rubric selected.</div>
        )}
      </div>

      <div className="flex flex-row gap-x-4 justify-between sm:justify-start">
        {/* Rubric Helper */}
        <RubricHelper />
        {/* Rubric Builder Button */}
        <CustomButton onClick={() => setShowRubricBuilder(true)} className="btn-shiny btn-shiny-teal">
          <Blocks />
          <h2>Rubric Builder</h2>
        </CustomButton>
      </div>

      {/* Rubric Search */}
      <RubricSearch useCustomRubrics={useCustomRubrics} openRubricBuilder={openRubricBuilder} />

      {/* Custom Rubric Builder Modal */}
      <div className={`bg-secondary p-2 absolute top-[60px] md:top-[90px] h-fit max-h-[78%] rounded-l-lg border-2 border-r-0 border-primary-40 left-2 right-0 scroll shadow-lg overflow-y-auto  
                        ${showRubricBuilder ? 'animate-enter' : isExiting ? 'animate-exit' : 'hidden'}`}>
        <RubricBuilder
          onSave={async (customRubric) => {
            if (uid) {
              const customRubricRef = doc(collection(db, "users", uid, "custom_rubrics"));
              await setDoc(customRubricRef, {
                ...customRubric,
                id: customRubricRef.id,
                timestamp: Timestamp.now(),
              });
              setRubricOptions([...rubricOptions, customRubric]);
              setSelectedRubric(customRubric);

              toast.success("Custom rubric saved successfully!");
            } else {
              toast.error("Please log in to save a custom rubric.");
            }
            closeRubricBuilder();
          }}
          onCancel={closeRubricBuilder}
        />
      </div>
    </div>
  );
}
