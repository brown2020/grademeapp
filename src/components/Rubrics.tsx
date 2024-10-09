"use client"

import { useEffect, useState } from "react";
import { RubricState } from "@/types/rubrics-types"; // Adjust the import path as necessary
import { collection, getDocs, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useRubricStore } from "@/zustand/useRubricStore";
import { Switch, Button } from "@headlessui/react";
import { toast } from "react-hot-toast";

import RubricDisplay from "@/components/rubrics/RubricDisplay";
import CustomRubricBuilder from "@/components/rubrics/RubricCustom";
import RubricSearch from "@/components/rubrics/RubricSearch";
import RubricHelper from "@/components/rubrics/RubricHelper";

export default function Rubrics() {
    const { uid } = useAuthStore();
    const { rubricOptions, setRubricOptions, selectedRubric, setSelectedRubric, useCustomRubrics, setUseCustomRubrics } = useRubricStore();
    const [showCustomRubricBuilder, setShowCustomRubricBuilder] = useState<boolean>(false);

    // Fetch default rubrics or custom rubrics based on toggle
    useEffect(() => {
        if (useCustomRubrics && uid) {
            const fetchCustomRubrics = async () => {
                const customRubricCollection = collection(db, "users", uid, "custom_rubrics");
                const customRubricSnapshot = await getDocs(customRubricCollection);
                const fetchedRubrics = customRubricSnapshot.docs.map((doc) => doc.data() as RubricState);
                setRubricOptions(fetchedRubrics);
                if (fetchedRubrics.length > 0) {
                    setSelectedRubric(fetchedRubrics[0]);
                }
            };
            fetchCustomRubrics();
        }
    }, [useCustomRubrics, uid, setRubricOptions, setSelectedRubric]);

    return (
        <div className="space-y-4">
            {/* Rubric Helper */}
            <RubricHelper />
            {/* Rubric Search */}
            <RubricSearch />

            {/* Use Custom Rubrics Toggle */}
            <div className="flex items-center space-x-2">
                <Switch
                    checked={useCustomRubrics}
                    onChange={setUseCustomRubrics}
                    className={`${useCustomRubrics ? "bg-orange-600" : "bg-gray-200"} relative inline-flex items-center h-6 rounded-full w-11`}
                >
                    <span className="sr-only">Use Custom Rubrics</span>
                    <span
                        className={`${useCustomRubrics ? "translate-x-6" : "translate-x-1"} inline-block w-4 h-4 transform bg-white rounded-full`}
                    />
                </Switch>
                <label className="text-sm">{useCustomRubrics ? "Using Custom Rubrics" : "Using Default Rubrics"}</label>
            </div>

            {/* Rubric Display */}
            {selectedRubric && (
                <div className="flex flex-col w-full gap-y-2 p-2 border rounded bg-orange-100">
                    <h2 className="text-sm font-bold text-center">{selectedRubric.name}</h2>
                    <p className="text-sm text-gray-700">{selectedRubric.description}</p>
                    <RubricDisplay rubric={selectedRubric} />
                </div>
            )}            

            {/* Custom Rubric Button */}
            <Button
                type="button"
                onClick={() => setShowCustomRubricBuilder(true)}
                className="w-full font-medium py-1 rounded-md bg-orange-500 hover:bg-orange-400 text-gray-200 shadow"
            >
                Create Custom Rubric
            </Button>

            {/* Custom Rubric Builder Modal */}
            {showCustomRubricBuilder && (
                <div className="fixed top-8 left-0 right-0 bottom-16 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-transparent scroll shadow-lg p-2 w-96 sm:w-[1000px] h-full overflow-y-scroll">
                        <CustomRubricBuilder
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
                                setShowCustomRubricBuilder(false);
                            }}
                            onCancel={() => setShowCustomRubricBuilder(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
