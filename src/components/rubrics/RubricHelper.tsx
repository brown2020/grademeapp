"use client";

import { useEffect, useState } from "react";
import CustomListbox from "@/components/ui/CustomListbox";
import { Field } from "@headlessui/react";
import TextareaAutosize from "react-textarea-autosize";
import { getVerbsByValue, userInputs } from "@/constants/userInputs";
import { useRubricStore } from "@/zustand/useRubricStore";

export default function RubricHelper() {
    const { gradingData, setGradingData } = useRubricStore();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    console.log(gradingData)

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setGradingData({ ...gradingData, [name]: value });
    };

    const handleReset = () => {
        // Clear gradingData
        setGradingData({
            identity: "",
            identityLevel: "",
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

    // Update prose based on text type change
    useEffect(() => {
        if (gradingData.textType && userInputs.prose.details[gradingData.textType]) {
            const proseOptions = userInputs.prose.details[gradingData.textType]?.options || [];
            if (proseOptions.length > 0 && gradingData.prose !== proseOptions[0]) {
                setGradingData({ ...gradingData, prose: proseOptions[0] });
            }
        }
    }, [gradingData, gradingData.textType, gradingData.prose, setGradingData]);

    return (
        <div>
            <div onClick={() => setIsOpen(!isOpen)} className="bg-orange-500 text-center w-full px-2 py-1 mb-1 rounded-md shadow-md hover:bg-orange-400 text-gray-100 font-medium cursor-pointer">
                Use Rubric Helper
            </div>

            {isOpen && (
                <>
                    <div className="flex flex-col flex-wrap items-left text-md space-y-2 border rounded-lg px-2 py-2 bg-orange-100">
                        <div className="flex flex-row items-center relative">
                            <div onClick={handleReset} className="bg-red-600 px-2 py-1 rounded-md shadow cursor-pointer text-sm text-gray-200 absolute right-2 top-2">
                                Reset
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center mr-2">
                            <span className="mr-2">I am a</span>
                            <div className="flex flex-row gap-x-2">
                                {/* Identity Level */}
                                {gradingData.identity && (
                                    <CustomListbox
                                        value={gradingData.identityLevel}
                                        options={userInputs.identity.identityLevels[gradingData.identity].map((level) => ({
                                            label: level,
                                            value: level,
                                        }))}
                                        onChange={(value) => {
                                            if (gradingData.identityLevel !== value) {
                                                setGradingData({ ...gradingData, identityLevel: value });
                                            }
                                        }}
                                        buttonClassName="w-fit"
                                        placeholder="Select..."
                                    />
                                )}
                                {/* Identity Selection */}
                                <CustomListbox
                                    value={gradingData.identity}
                                    options={userInputs.identity.options.map((identity) => ({
                                        label: identity,
                                        value: identity,
                                    }))}
                                    onChange={(value) => {
                                        if (gradingData.identity !== value) {
                                            setGradingData({ ...gradingData, identity: value });
                                        }
                                    }}
                                    buttonClassName="w-fit"
                                    placeholder="Select..."
                                />
                            </div>
                            <span className="w-fit ml-0.5">.</span>
                        </div>

                        {/* My [assigner] has asked me to [text_type][verb] [topic] in a(n) [prose] for [audience]. */}
                        {gradingData.identity && (
                            <div className="flex flex-wrap items-center gap-y-2">
                                <hr className="w-full border-t-2 border-gray-300" />
                                <div className="flex flex-row flex-wrap items-center">
                                    <span className="w-fit mr-2">My</span>
                                    <div className="w-fit mr-2">
                                        <CustomListbox
                                            value={gradingData.assigner}
                                            options={userInputs.assigner.options[gradingData.identity || "person"]?.map((assigner) => ({
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
                                            value={getVerbsByValue(gradingData.textType).join(", ")}
                                            options={userInputs.textType.map((textType) => ({
                                                label: textType.verbs.join(", "),
                                                value: textType.value || "",
                                            }))}
                                            onChange={(value) => {
                                                if (gradingData.textType !== value) {
                                                    setGradingData({ ...gradingData, textType: value });
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
                                        placeholder="Explain the topic"
                                        className="border rounded w-full px-2 py-1"
                                    />
                                </Field>

                                <span className="w-fit mx-2">in a(n)</span>

                                {gradingData.textType && userInputs.prose.details[gradingData.textType] && (
                                    <div className="w-fit mr-2">
                                        <CustomListbox
                                            value={gradingData.prose}
                                            options={userInputs.prose.details[gradingData.textType]?.options?.map((prose) => ({
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
                                {gradingData.identity && userInputs.audience.contextBasedAudiences[gradingData.identity] && (
                                    <div className="w-fit mr-2 flex">
                                        <CustomListbox
                                            value={gradingData.audience}
                                            options={userInputs.audience.contextBasedAudiences[gradingData.identity]?.map((audience) => ({
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
                                )}

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
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
