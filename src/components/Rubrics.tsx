"use client"

import { useState } from "react";
import { RubricState } from "@/types/rubrics-types"; // Adjust the import path as necessary
import { collection, getDocs, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useRubricStore } from "@/zustand/useRubricStore";
import { Switch } from "@headlessui/react";
import { toast } from "react-hot-toast";

import RubricDisplay from "@/components/rubrics/RubricDisplay";
import RubricBuilder from "@/components/rubrics/RubricBuilder";
import RubricSearch from "@/components/rubrics/RubricSearch";
import RubricHelper from "@/components/rubrics/RubricHelper";

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
        setShowRubricBuilder(false);
        setIsExiting(true);
        setTimeout(() => {
            setIsExiting(false);
        }, 300); // Match the duration of your exit animation
    };

    return (
        <div className="space-y-3">
            <div>
                <div className="flex flex-row justify-between">
                    <h1 className="text-xl font-bold text-left text-accent">Selected Rubric</h1>
                    {/* Use Custom Rubrics Toggle */}
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={useCustomRubrics}
                            onChange={() => handleCustomRubrics()}
                            className={`${useCustomRubrics ? "bg-accent" : "bg-gray-200"} transition duration-300 ease-in-out relative inline-flex items-center h-6 rounded-full w-11`}
                        >
                            <span className="sr-only">Use Custom Rubrics</span>
                            <span
                                className={`${useCustomRubrics ? "translate-x-6" : "translate-x-1"} transition duration-300 ease-in-out inline-block w-4 h-4 transform bg-white rounded-full`}
                            />
                        </Switch>
                        <label className="text-xs w-[120px]">{useCustomRubrics ? "Using Custom Rubrics" : "Using Default Rubrics"}</label>
                    </div>
                </div>
                <hr className="border border-accent" />
            </div>
            {/* Rubric Display */}
            <div className="flex flex-col w-full p-2 text-sm border border-dashed rounded-lg bg-secondary">
                <h2 className=" font-bold text-center">{selectedRubric ? selectedRubric.name : "Select a rubric..."}</h2>
                <p className=" text-gray-700">{selectedRubric ? selectedRubric.description : "..."}</p>
                {selectedRubric ? (
                    <RubricDisplay rubric={selectedRubric} />
                ) : (
                    <div className="flex items-center justify-center h-24  text-gray-700">No rubric selected.</div>
                )}
            </div>

            <div className="flex flex-row justify-between">
                {/* Rubric Helper */}
                <RubricHelper />
                {/* Custom Rubric Button */}
                <div
                    onClick={() => setShowRubricBuilder(true)}
                    className="bg-primary text-center w-40 px-2 py-1 mb-1 rounded-lg shadow-md hover:bg-accent text-background font-medium cursor-pointer"
                >
                    Rubric Builder
                </div>
            </div>

            {/* Rubric Search */}
            <RubricSearch useCustomRubrics={useCustomRubrics} openRubricBuilder={openRubricBuilder} />

            {/* Custom Rubric Builder Modal */}

            {/* <div className={`bg-black/30 absolute inset-0 w-full h-full z-10 ${showRubricBuilder ? 'animate-enter' : isExiting ? 'animate-exit' : 'hidden'}`} aria-hidden="true" /> */}
            <div className={`absolute top-[60px] rounded-l-lg border-2 border-r-0 border-primary left-2 right-0 bottom-[100px] scroll shadow-lg p-2 bg-background overflow-y-auto 
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
