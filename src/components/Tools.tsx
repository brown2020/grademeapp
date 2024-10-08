"use client";

import { useCallback, useState, useEffect, FormEvent } from "react";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import { db, storage } from "@/firebase/firebaseClient";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore from "@/zustand/useProfileStore";
import { PulseLoader } from "react-spinners";
import { generateGrade } from "@/actions/generateResponse";
import { parseDocumentFromUrl } from "@/actions/parseDocumentFromUrl";
import { readStreamableValue } from "ai/rsc";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import { extractGrade } from "@/utils/responseParser";
import { toast } from "react-hot-toast";
import { Field, Label, Button } from "@headlessui/react";
import CustomListbox from "@/components/ui/CustomListbox";
import RubricDisplay from "@/components/ui/RubricDisplay";
import CustomRubricBuilder from "@/components/RubricCustom";
import { debounce } from "lodash";
import { Paperclip } from "lucide-react"
import { FormData } from "@/types/formdata";
import { userInputs } from "@/constants/userInputs";
import { getRubricsByCriteria, getDefaultRubrics } from "@/constants/rubrics_new";
import { RubricState } from "@/types/rubrics-types"
import RubricHelper from "@/components/RubricHelper";


// Define types for the saveHistory function
async function saveHistory(
    uid: string | null,
    userInput: FormData,
    response: string,
    grade: string,
    fileUrl: string | null
): Promise<void> {
    if (!uid) return;

    const docRef = doc(collection(db, "users", uid, "summaries"));
    await setDoc(docRef, {
        id: docRef.id,
        userInput,
        response,
        grade,
        fileUrl,
        timestamp: Timestamp.now(),
    });
    console.log("History saved successfully.");
}

export default function Tools() {
    const { uid } = useAuthStore();
    const { profile, minusCredits } = useProfileStore();
    const [summary, setSummary] = useState<string>("");
    const [flagged, setFlagged] = useState<string>("");
    const [active, setActive] = useState<boolean>(false);
    const [grade, setGrade] = useState<string>("");
    const [thinking, setThinking] = useState<boolean>(false);
    const [localCount, setLocalCount] = useState<number>(profile.credits);
    const [isStreamingComplete, setIsStreamingComplete] = useState<boolean>(false);
    const [hasSaved, setHasSaved] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);
    const [fileUrl, setFileUrl] = useState<string>("");
    const [showCustomRubricBuilder, setShowCustomRubricBuilder] = useState<boolean>(false);
    const [rubricNames, setRubricNames] = useState<string[]>([]);
    const [rubricOptions, setRubricOptions] = useState<RubricState[]>([]);
    const [formData, setFormData] = useState<FormData>({
        title: "", // Title of the text
        text: "", // The text of the essay
        identity: "default", // Identity of the user
        identityLevel: "", // Level of the identity (student, researcher, etc.)
        assigner: "", // Instructor or person assigning the task
        textType: "", // Type of text (narrative, descriptive, argumentative, etc.)
        topic: "", // Topic of the assignment
        prose: "", // Type of prose (essay, short story, etc.)
        audience: "", // Intended audience
        wordLimitType: "less than", // Defaults to "less than"; user can change to "more than" or "between"
        wordLimit: "", // Word limit value as a number or string
        customRubric: "", // Optional custom rubric (empty if not used)
        rubric: rubricOptions[0] || null, // Specific rubric chosen from list
    });

    // Fetch rubrics based on form criteria
    useEffect(() => {
        const debouncedFetchRubrics = debounce(() => {
            if (formData.identity === "default") {
                const rubrics = getDefaultRubrics();
                setRubricOptions(rubrics);
                setRubricNames(rubrics.map((rubric) => rubric.name));
                setFormData((prevFormData) => ({ ...prevFormData, rubric: rubrics[0] }));
            }
            if (formData.identity && formData.identityLevel && formData.textType && formData.prose) {
                const rubrics = getRubricsByCriteria(formData.identity, formData.identityLevel, formData.textType, formData.prose);
                if (rubrics.length > 0) {
                    setRubricOptions(rubrics);
                    setRubricNames(rubrics.map((rubric) => rubric.name));
                    setFormData((prevFormData) => ({ ...prevFormData, rubric: rubrics[0] }));
                }
            }
        }, 300);
        debouncedFetchRubrics();
        return () => {
            debouncedFetchRubrics.cancel();
        };
    }, [formData.identity, formData.identityLevel, formData.textType, formData.prose, setFormData, setRubricNames, setRubricOptions]);

    console.log("form data: ", formData);

    // useEffect to update prose based on text type change
    useEffect(() => {
        // Check if a new text type is selected and there are options for the prose
        if (formData.textType && userInputs.prose.details[formData.textType]) {
            const proseOptions = userInputs.prose.details[formData.textType]?.options || [];
            if (proseOptions.length > 0) {
                // Set the formData.prose to the first option in the list
                setFormData(prevFormData => ({
                    ...prevFormData,
                    prose: proseOptions[0] // Set the first option as the default value
                }));
            }
        }
    }, [formData.textType]);

    // Handle file upload
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile && uid) {
            setUploading(true);
            toast.loading("Uploading file...");

            // Log file information for debugging
            // console.log('Uploading file:', selectedFile.name, 'of type:', selectedFile.type, 'and size:', selectedFile.size);

            try {
                const fileNameWithoutExtension = ((selectedFile.name).split('.')[0]);
                setFormData((prevFormData) => ({ ...prevFormData, title: fileNameWithoutExtension }));

                const fileRef = ref(storage, `uploads/${uid}/${selectedFile.name}`);
                await uploadBytes(fileRef, selectedFile);

                const downloadURL = await getDownloadURL(fileRef);
                setFileUrl(downloadURL);

                const parsedText = await parseDocumentFromUrl(downloadURL);
                setFormData((prevFormData) => ({ ...prevFormData, text: parsedText }));
            } catch (error) {
                console.error('Failed to upload file:', error);
                toast.dismiss();
                toast.error('Failed to upload file. Please try again.');
            } finally {
                setUploading(false);
                toast.dismiss();
                toast.success('File uploaded successfully.');
            }
        } else if (!uid) {
            toast.error('Please log in to upload a file.');
            console.error('User is not authenticated');
        }
    };

    // Enable submit button if conditions are met
    useEffect(() => {
        setActive(formData.topic.length > 1 && localCount > 0 && !uploading);
    }, [localCount, formData.topic, uploading]);


    // Handle form submission
    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        setActive(false);
        setSummary("");
        setFlagged("");
        setThinking(true);
        setIsStreamingComplete(false);
        setHasSaved(false);

        console.log("Form Data:", formData);

        // convert rubric to string
        const rubricString = JSON.stringify(formData.rubric);
        console.log("Selected Rubric:", rubricString);

        try {
            const { identity, identityLevel, assigner, topic, prose, audience, wordLimitType, wordLimit, title, text } = formData;

            const { result, creditsUsed } = await generateGrade(
                identity,
                identityLevel,
                assigner,
                topic,
                prose,
                audience,
                wordLimitType,
                wordLimit,
                rubricString,
                title,
                text,
                profile.credits
            );

            if (!result) throw new Error("No response");

            const creditsDeducted = await minusCredits(creditsUsed);

            if (!creditsDeducted) {
                throw new Error("Failed to deduct credits.");
            }

            for await (const content of readStreamableValue(result)) {
                if (content) {
                    setSummary(content.trim());
                    setGrade(extractGrade(content.trim()));
                }
            }

            setLocalCount((prev) => prev - creditsUsed);
            // setPrompt(userPrompt);
            setThinking(false);
            setIsStreamingComplete(true);
        } catch (error) {
            console.error(error);
            setThinking(false);
            setFlagged(
                "No suggestions found. Servers might be overloaded right now."
            );
        }
    }, [formData, profile.credits, minusCredits]);

    // Effect to handle saving to history
    useEffect(() => {
        if (isStreamingComplete && !hasSaved && summary) {
            saveHistory(uid, formData, summary, grade, fileUrl || null).then(() => {
                setHasSaved(true);
            });
        }
    }, [isStreamingComplete, hasSaved, summary, uid, formData, grade, fileUrl]);

    // Scroll into view when content changes
    useEffect(() => {
        if (summary) {
            document.getElementById("response")?.scrollIntoView({ behavior: "smooth" });
        }
        // else if (prompt) {
        //     document.getElementById("prompt")?.scrollIntoView({ behavior: "smooth" });
        // } 
        else if (flagged) {
            document.getElementById("flagged")?.scrollIntoView({ behavior: "smooth" });
        }
    }, [summary, flagged]);

    return (
        <div className="form-wrapper space-y-8 font-medium">
            <form onSubmit={handleSubmit}>

                {/* Rubric Display */}
                <div className="flex flex-col min-w-full w-full items-left text-md border rounded-lg px-2 py-1">
                    {/* Rubric: [rubric] */}
                    <div className="flex flex-col flex-wrap items-center gap-y-4">
                        {/* rubric */}
                        <div className="w-full">
                            <Field>
                                <Label className="block text-sm font-medium text-gray-700 w-full" htmlFor="rubric">Select Rubric</Label>
                                <RubricHelper
                                    formData={formData}
                                    setFormData={setFormData}
                                    setRubricOptions={setRubricOptions}
                                    setRubricNames={setRubricNames}
                                    rubricOptions={rubricOptions}
                                />
                                {rubricOptions && rubricOptions.length > 0 && (
                                    <CustomListbox
                                        value={formData.rubric.name}
                                        options={rubricNames.map((rubric) => ({ label: rubric, value: rubric }))}
                                        onChange={(rubricName) => setFormData((prevFormData) => ({ ...prevFormData, rubric: rubricOptions.find((rubric) => rubric.name === rubricName) || prevFormData.rubric }))}
                                        buttonClassName="bg-orange-500 text-center w-full px-2 py-1 rounded shadow-md hover:bg-orange-400 text-gray-100 font-medium mt-4"
                                        optionsWrapperClassName="w-fit"
                                        placeholder="Select a Rubric"
                                    />
                                )}
                            </Field>
                        </div>
                        {/* Rubric Details */}
                        {formData.rubric && (
                            <div className="flex flex-col w-full gap-y-2 p-2 border rounded bg-orange-100">
                                <h2 className="text-sm font-bold text-center">{formData.rubric.name}</h2>
                                <p className="text-sm text-gray-700">{formData.rubric.description}</p>

                                {/* Expandable Criteria Sections */}
                                <div className="">
                                    {formData.rubric && (
                                        <RubricDisplay rubric={formData.rubric} key={formData.rubric.name} />
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Misc details - audience, word limit */}
                        <div className="flex flex-col w-full p-2 gap-y-2 bg-orange-100 border rounded ">
                            <label>Misc.</label>
                            {/* Audience */}
                            <div className="w-full flex flex-row gap-x-2 items-center">
                                <label className="block text-sm font-medium text-gray-700">Audience: </label>
                                <input
                                    type="text"
                                    name="audience"
                                    id="audience"
                                    value={formData.audience}
                                    onChange={(e) => setFormData((prevFormData) => ({ ...prevFormData, audience: e.target.value }))}
                                    placeholder="My fans..."
                                    className="flex h-8 w-36 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-lg"
                                />
                            </div>
                            {/* Word Limit */}
                            <div className="flex flex-row w-full">
                                <div className="flex flex-row gap-x-2 items-center">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="wordLimit">Word Limit: </label>
                                    <CustomListbox
                                        value={formData.wordLimitType}
                                        options={userInputs.wordCount.comparisonType.map(option => ({ label: option, value: option }))}
                                        onChange={(value) => setFormData((prevFormData) => ({ ...prevFormData, wordLimitType: value }))}
                                        buttonClassName="w-fit flex"
                                        placeholder="Select..."
                                    />
                                    <input
                                        type="number"
                                        name="wordLimit"
                                        id="wordLimit"
                                        value={formData.wordLimit}
                                        onChange={(e) => setFormData((prevFormData) => ({ ...prevFormData, wordLimit: e.target.value }))}
                                        placeholder="Enter word limit"
                                        className="flex h-8 w-28 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Custom Rubric Button */}
                        <Button
                            type="button"
                            onClick={() => setShowCustomRubricBuilder(true)}
                            className="w-full"
                        >
                            Create Custom Rubric
                        </Button>
                    </div>
                </div>

                {/* Title */}
                <Field>
                    <Label className="block text-sm font-medium text-gray-700" htmlFor="title">Title</Label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData((prevFormData) => ({ ...prevFormData, title: e.target.value }))}
                        placeholder="Enter the title here"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </Field>

                {/* Text Area and File Upload */}
                <div className="relative">
                    {/* File Upload */}
                    <div className="absolute flex flex-row items-center gap-x-2 left-8 group">
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <Paperclip className="size-4" />
                            {/* Hidden file input */}
                            <input
                                id="file-upload"
                                type="file"
                                accept=".docx,.pdf,.odt,.txt"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 w-32 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Upload a file (docx, pdf, odt, txt)
                        </div>
                    </div>

                    {/* Text Area */}
                    <Field refName="text">
                        <Label className="block text-sm font-medium text-gray-700" htmlFor="text">Text</Label>
                        <TextareaAutosize
                            id="text"
                            name="text"
                            value={formData.text}
                            onChange={(e) => setFormData((prevFormData) => ({ ...prevFormData, text: e.target.value }))}
                            minRows={4}
                            placeholder="Upload your text or paste it here."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </Field>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!active || uploading}
                    className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {uploading ? 'Uploading...' : 'Grade'}
                </Button>

            </form>
            {thinking && <PulseLoader color="red" size={20} />}

            {summary && (
                <div className="px-5 py-2 shadow-lg bg-orange-200 rounded-md">
                    <ReactMarkdown>{summary}</ReactMarkdown>
                </div>
            )}

            {showCustomRubricBuilder && (
                <div className="fixed top-8 left-0 right-0 bottom-16 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white shadow-lg p-4 w-96 sm:w-[1000px] h-full overflow-y-scroll">
                        <CustomRubricBuilder
                            onSave={async (customRubric) => {
                                // Save the custom rubric to the database
                                if (uid) {
                                    const customRubricRef = doc(collection(db, "users", uid, "custom_rubrics"));
                                    await setDoc(customRubricRef, {
                                        ...customRubric,
                                        id: customRubricRef.id,
                                        timestamp: Timestamp.now(),
                                    });

                                    // Optionally, you can add the custom rubric to the rubric options in local state
                                    setRubricOptions((prev) => [...prev, customRubric]);
                                    setFormData((prev) => ({ ...prev, rubric: customRubric }));

                                    toast.success('Custom rubric saved successfully!');
                                } else {
                                    toast.error('Please log in to save a custom rubric.');
                                }

                                // Close the rubric builder
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