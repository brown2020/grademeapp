"use client";

import { useEffect, useState, useRef } from "react";
import CustomListbox from "@/components/ui/CustomListbox";
import { Field } from "@headlessui/react";
import TextareaAutosize from "react-textarea-autosize";
import { getVerbsByValue, userInputs } from "@/constants/userInputs";
import { useRubricStore } from "@/zustand/useRubricStore";
import useProfileStore from "@/zustand/useProfileStore";
import { LifeBuoy } from "lucide-react";

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
            textType: "",
            title: "",
            text: "",
        });
    };

    useEffect(() => {
        // Close the dialog when clicking outside of it
        function handleClickOutside(event: TouchEvent | MouseEvent) {
            if (isOpen &&
                rubricHelperRef.current &&
                !rubricHelperRef.current.contains(event.target as Node) &&
                !(event.target as HTMLElement).closest(".custom-listbox-options")) {
                closeRubricHelper();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [rubricHelperRef, isOpen]);

    const closeRubricHelper = () => {
        setIsOpen(false);
        setIsExiting(true);
        setTimeout(() => {
            setIsExiting(false);
        }, 300); // Match the duration of your exit animation
    };

    return (
        <div>
            <div onClick={isOpen ? closeRubricHelper : () => setIsOpen(true)} className="bg-accent w-40 flex flex-row gap-x-2 justify-center py-2 rounded-lg shadow-button active:shadow-pressed text-accent-foreground font-medium cursor-pointer transition-shadow duration-150 ease-in-out">
                <LifeBuoy />
                <h2>Rubric Helper</h2>
            </div>

            <div className={`bg-black/30 absolute inset-0 w-full h-full z-10 ${isOpen ? 'overlay-open' : 'overlay-closed'}`} aria-hidden="true" />
            <div
                ref={rubricHelperRef}
                className={`flex  flex-col bg-background border-primary border-t-2 border-l-2 border-b-2 p-2 rounded-l-lg fixed right-0 top-[100px] h-[310px] max-w-xs w-full z-10 transition-all ${isOpen ? 'animate-enter' : isExiting ? 'animate-exit' : 'hidden'}`}
            >
                <div className="flex flex-row gap-x-2 items-center justify-center mb-2">
                    <LifeBuoy className="text-primary" />
                    <h2 className="text-xl font-medium">Rubric Helper</h2>
                </div>
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
                            buttonClassName="w-fit"
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
                            buttonClassName="w-fit"
                            placeholder="select..."
                        />
                    </div>
                    <span className="w-fit ml-0.5">.</span>
                </div>

                {/* My [assigner] has asked me to [text_type][verb] [topic] in a(n) [prose] for [audience]. */}

                <div className="flex flex-wrap items-center gap-y-2">
                    <hr className="w-full border-t-2 border-gray-300" />
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
                                buttonClassName="w-[80px]"
                                placeholder="Select..."
                            />
                        </div>
                        <span className="w-fit mr-2">has asked </span>
                    </div>

                    <div className="flex flex-row flex-wrap items-center">
                        <span className="w-fit mr-2">me to</span>
                        <div className="w-fit mr-2">
                            <CustomListbox
                                value={getVerbsByValue(gradingData.textType ?? "narrative").join(", ")}
                                options={userInputs.textType.map((textType) => ({
                                    label: textType.verbs.join(", "),
                                    value: textType.value || "",
                                }))}
                                onChange={(value) => {
                                    console.log("value", value);
                                    if (gradingData.textType !== value) {
                                        setGradingData({ ...gradingData, textType: value, prose: userInputs.prose.details[value]?.options[0] });
                                    }
                                }}
                                buttonClassName="w-fit"
                                placeholder="Select..."
                            />
                        </div>
                    </div>

                    <Field className="flex items-center w-full">
                        <TextareaAutosize
                            id="topic"
                            name="topic"
                            value={gradingData.topic}
                            onChange={handleInputChange}
                            minRows={1}
                            placeholder="Explain the assignment"
                            className="border rounded-md w-full text-sm px-2 py-1"
                        />
                    </Field>

                    <span className="w-fit mx-2">in a(n)</span>

                    {gradingData.textType && userInputs.prose.details[gradingData.textType ?? "narrative"] && (
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
                                buttonClassName="w-fit"
                                placeholder="Select..."
                            />
                        </div>
                    )}

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
                            buttonClassName="w-fit"
                            placeholder="Select..."
                        />
                    </div>

                    <span className="w-fit mr-2">in </span>

                    {/* Word Limit */}
                    <div className="flex flex-row w-full">
                        <div className="flex flex-row gap-x-2 items-center">
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
                                buttonClassName="w-fit flex"
                                placeholder="Select..."
                            />
                            <input
                                type="number"
                                name="wordLimit"
                                id="wordLimit"
                                value={gradingData.wordLimit}
                                onChange={(e) => {
                                    if (gradingData.wordLimit !== e.target.value) {
                                        setGradingData({ ...gradingData, wordLimit: e.target.value });
                                    }
                                }}
                                placeholder="Enter word limit"
                                className="flex h-8 w-28 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-lg"
                            />
                        </div>
                    </div>
                </div>
                <div onClick={handleReset} className="bg-red-600 px-2 py-1 rounded-md shadow cursor-pointer text-sm text-gray-200 absolute bottom-2 right-2">
                    Reset
                </div>
            </div>
        </div>
    );
}
