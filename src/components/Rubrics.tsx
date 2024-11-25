"use client"

import { useState } from "react";
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
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import RubricsTour from "@/components/tours/RubricsTour"

export default function Rubrics() {
  const { uid } = useAuthStore();
  const {
    selectedRubric,
    useCustomRubrics,
    setUseCustomRubrics,
    resetToDefaultRubrics,
    fetchCustomRubrics,
    showRubricBuilder,
    setShowRubricBuilder,
    setEditingRubricId,
    showDeleteModal,
    setShowDeleteModal,
    rubricToDelete,
    setRubricToDelete,
    deleteCustomRubric,
  } = useRubricStore();
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);



  // Fetch default rubrics or custom rubrics based on toggle
  const handleCustomRubrics = async () => {
    const newUseCustomRubrics = !useCustomRubrics;
    setUseCustomRubrics(newUseCustomRubrics);

    if (newUseCustomRubrics && uid) {
      await fetchCustomRubrics(uid);
      toast.success("Custom rubrics loaded.");
    } else {
      resetToDefaultRubrics();
      toast.success("Default rubrics loaded.");
    }
  };

  const handleCloseRubricBuilder = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowRubricBuilder(false);
      setIsExiting(false);
      setEditingRubricId(undefined);
    }, 150);
  };

  const onDeleteConfirm = async () => {
    if (rubricToDelete) {
      console.log("onDeleteConfirm", rubricToDelete);
      try {
        await deleteCustomRubric();
        toast.success("Rubric deleted successfully");
      } catch (error) {
        console.error("Error deleting rubric:", error);
        toast.error("Failed to delete rubric. Please try again.");
      } finally {
        setShowDeleteModal(false);
        setRubricToDelete(null);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <div className="flex flex-row justify-between">
          <div className="flex gap-x-1 items-center">
            <RubricsTour />
            <h1>Rubrics</h1>

          </div>
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
          <h2 className="text-primary-20 font-bold underline underline-offset-2 rubric-selected">{selectedRubric ? selectedRubric.name : "Select a rubric..."}</h2>
        </div>
        <p className="sm:relative text-sm max-w-xs truncate mb-1 hidden">{selectedRubric ? selectedRubric.description : "..."}</p>

        {selectedRubric ? (
          <RubricDisplay rubric={selectedRubric} />
        ) : (
          <div className="flex items-center justify-center h-52">No rubric selected. Search for and select a rubric below.</div>
        )}
      </div>

      <div className="flex flex-row gap-x-4 justify-between sm:justify-start">
        {/* Rubric Helper */}
        <div className="rubric-helper">
          <RubricHelper />
        </div>
        {/* Rubric Builder Button */}
        <CustomButton onClick={() => setShowRubricBuilder(true)} className="btn-shiny btn-shiny-teal rubric-builder">
          <Blocks />
          <h2>Rubric Builder</h2>
        </CustomButton>
      </div>

      {/* Rubric Search */}
      <RubricSearch />

      {/* Custom Rubric Builder Modal */}
      <div className={`bg-secondary p-2 absolute top-[54px] md:top-[90px] h-fit max-h-[84%] rounded-l-lg border-2 border-r-0 border-primary-40 left-2 right-0 scroll shadow-lg overflow-y-auto ${showRubricBuilder ? 'animate-enter' : isExiting ? 'animate-exit' : 'hidden'}`}>
        <RubricBuilder onClose={handleCloseRubricBuilder} />
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onDeleteConfirm}
        title="Confirm Rubric Deletion"
        description="Are you sure you want to delete this rubric? This action cannot be undone."
        confirmText="Delete my rubric"
        itemName={rubricToDelete?.name}
      />
    </div>
  );
}
