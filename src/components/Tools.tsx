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
import { Field, Label, Button, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { debounce } from "lodash";
import { Paperclip } from "lucide-react"
import { FormData } from "@/types/formdata";
import { userInputs, getVerbByValue } from "@/constants/userInputs";
import { getRubricsByCriteria, Rubric } from "@/constants/rubrics_new";

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
    // const [prompt, setPrompt] = useState<string>("");
    const [grade, setGrade] = useState<string>("");
    const [thinking, setThinking] = useState<boolean>(false);
    const [localCount, setLocalCount] = useState<number>(profile.credits);
    const [isStreamingComplete, setIsStreamingComplete] = useState<boolean>(false);
    const [hasSaved, setHasSaved] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);
    const [fileUrl, setFileUrl] = useState<string>("");
    const [rubricNames, setRubricNames] = useState<string[]>([]);
    const [rubricOptions, setRubricOptions] = useState<Rubric[]>([]);
    const [formData, setFormData] = useState<FormData>({
        title: "", // Title of the text
        text: "", // The text of the essay
        identity: "student", // Identity of the user
        identityLevel: "3rd grade", // Level of the identity (student, researcher, etc.)
        assigner: "teacher", // Instructor or person assigning the task
        textType: "narrative", // Type of text (narrative, descriptive, argumentative, etc.)
        topic: "", // Topic of the assignment
        prose: "", // Type of prose (essay, short story, etc.)
        audience: "", // Intended audience
        wordLimitType: "less than", // Defaults to "less than"; user can change to "more than" or "between"
        wordLimit: "", // Word limit value as a number or string
        customRubric: "", // Optional custom rubric (empty if not used)
        rubric: "", // Specific rubric chosen from list
    });

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Fetch rubrics based on form criteria
    useEffect(() => {
        const debouncedFetchRubrics = debounce(() => {
            if (formData.identity && formData.identityLevel && formData.textType && formData.prose) {
                const rubrics = getRubricsByCriteria(formData.identity, formData.identityLevel, formData.textType, formData.prose);
                if (rubrics.length > 0) {
                    // get full rubric details from the selected rubric, use watchedRubris to get the selected rubric
                    setRubricOptions(rubrics);
                    setRubricNames(rubrics.map((rubric) => rubric.name)); // Set only the names for the Select
                }
            }
        }, 300); // 300 ms debounce
        debouncedFetchRubrics();
        return () => {
            debouncedFetchRubrics.cancel(); // Cleanup on unmount or value change
        };
    }, [formData.identity, formData.identityLevel, formData.textType, formData.prose]);

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
        const rubric = rubricOptions.find((rubric) => rubric.name === formData.rubric);
        // convert rubric to string
        const rubricString = rubric ? JSON.stringify(rubric) : "";
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
    }, [formData, profile.credits, minusCredits, rubricOptions]);

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
        <div className="form-wrapper space-y-8">
            <form onSubmit={handleSubmit}>
                {/* User Inputs */}
                <div className="flex flex-col flex-wrap items-left text-md space-y-2 border rounded-lg px-2 py-1">
                    {/* I am a [identity_level] [identity].  */}
                    <div className="flex flex-wrap items-center mr-2">
                        <span className="mr-2">I am a</span>
                        <div className="flex flex-row gap-x-2">
                            {/* Identity Level */}
                            {formData.identity && (
                                <>
                                    <Listbox
                                        value={formData.identityLevel}
                                        onChange={(value) => setFormData((prevFormData) => ({ ...prevFormData, identityLevel: value }))}
                                    >
                                        <ListboxButton>{formData.identityLevel}</ListboxButton>
                                        <ListboxOptions>
                                            {userInputs.identity.identityLevels[formData.identity].map((level) => (
                                                <ListboxOption key={level} value={level}>
                                                    {level}
                                                </ListboxOption>
                                            ))}
                                        </ListboxOptions>
                                    </Listbox>
                                </>
                            )}
                            {/* Identity Selection */}
                            <Listbox
                                value={formData.identity}
                                onChange={(value) => setFormData((prevFormData) => ({ ...prevFormData, identity: value }))}
                            >
                                <ListboxButton>{formData.identity}</ListboxButton>
                                <ListboxOptions>
                                    {userInputs.identity.options.map((identity) => (
                                        <ListboxOption key={identity} value={identity}>
                                            {identity}
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </Listbox>
                        </div>
                        <span className="w-fit mr-2">.</span>
                    </div>
                    <hr className="w-full border-t-2 border-gray-300" />
                    {/* My [assigner] has asked me to [text_type][verb] [topic] in a(n) [prose] for [audience]. */}
                    <div className="flex flex-wrap items-center gap-y-2">
                        <span className="w-fit mr-2">My</span>

                        {/* Assigner */}
                        <div className="w-fit mr-2">
                            <Listbox
                                value={formData.assigner}
                                onChange={(value) => setFormData((prevFormData) => ({ ...prevFormData, assigner: value }))}
                            >
                                <ListboxButton className="border rounded px-2 py-1">
                                    {formData.assigner || "Select Assigner"}
                                </ListboxButton>
                                <ListboxOptions>
                                    {userInputs.assigner.options[formData.identity]?.map((assigner) => (
                                        <ListboxOption key={assigner} value={assigner}>
                                            {assigner}
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </Listbox>
                        </div>

                        <span className="w-fit mr-2">has asked me to</span>

                        {/* Text Type */}
                        <div className="w-fit mr-2">
                            <Listbox
                                value={formData.textType}
                                onChange={(value) => setFormData((prevFormData) => ({ ...prevFormData, textType: value }))}
                            >
                                <ListboxButton className="border rounded px-2 py-1">
                                    {getVerbByValue(formData.textType) || "Select Text Type"}
                                </ListboxButton>
                                <ListboxOptions>
                                    {userInputs.textType.map((textType) => (
                                        <ListboxOption key={textType.value} value={textType.value}>
                                            {textType.verb}
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </Listbox>
                        </div>

                        {/* Topic */}
                        <Field className="flex items-center">
                            <TextareaAutosize
                                id="topic"
                                name="topic"
                                value={formData.topic}
                                onChange={handleInputChange}
                                minRows={1}
                                placeholder="Explain the topic"
                                className="border rounded w-full px-2 py-1"
                            />
                        </Field>

                        <span className="w-fit mr-2">in a(n)</span>

                        {/* Prose */}
                        {formData.textType && userInputs.prose.details[formData.textType] && (
                            <div className="w-fit mr-2">
                                <Listbox
                                    value={formData.prose}
                                    onChange={(value) => setFormData((prevFormData) => ({ ...prevFormData, prose: value }))}
                                >
                                    <ListboxButton className="border rounded px-2 py-1">
                                        {formData.prose || "Select Prose"}
                                    </ListboxButton>
                                    <ListboxOptions>
                                        {userInputs.prose.details[formData.textType]?.options.map((prose) => (
                                            <ListboxOption key={prose} value={prose}>
                                                {prose}
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </Listbox>
                            </div>
                        )}

                        <span className="w-fit mr-2">for</span>

                        {/* Audience */}
                        {formData.identity && userInputs.audience.contextBasedAudiences[formData.identity] && (
                            <div className="w-fit mr-2">
                                <Listbox
                                    value={formData.audience}
                                    onChange={(value) => setFormData((prevFormData) => ({ ...prevFormData, audience: value }))}
                                >
                                    <ListboxButton className="border rounded px-2 py-1">
                                        {formData.audience || "Select Audience"}
                                    </ListboxButton>
                                    <ListboxOptions>
                                        {userInputs.audience.contextBasedAudiences[formData.identity].map((audience) => (
                                            <ListboxOption key={audience} value={audience}>
                                                {audience}
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </Listbox>
                            </div>
                        )}

                        <span className="w-fit mr-2">in</span>

                        {/* Word Limit Type */}
                        <div className="w-fit mr-2">
                            <Listbox
                                value={formData.wordLimitType}
                                onChange={(value) => setFormData((prevFormData) => ({ ...prevFormData, wordLimitType: value }))}
                            >
                                <ListboxButton className="border rounded px-2 py-1">
                                    {formData.wordLimitType || "Select Word Limit Type"}
                                </ListboxButton>
                                <ListboxOptions>
                                    <ListboxOption value="less">less than</ListboxOption>
                                    <ListboxOption value="more">more than</ListboxOption>
                                    <ListboxOption value="between">between</ListboxOption>
                                </ListboxOptions>
                            </Listbox>
                        </div>

                        {/* Word Limit */}
                        <div className="w-20 mr-2">
                            <input
                                type="number"
                                id="wordLimit"
                                name="wordLimit"
                                value={formData.wordLimit}
                                onChange={handleInputChange}
                                className="border rounded px-2 py-1 w-full"
                            />
                        </div>

                        <span className="w-fit mr-2">words.</span>
                    </div>

                    <hr className="w-full border-t-2 border-gray-300" />
                    {/* Rubric: [rubric] */}
                    <div className="flex flex-wrap items-center">
                        {/* rubric */}
                        <div className="w-fit mr-2">
                            <Field>
                                <Label className="block text-sm font-medium text-gray-700">Rubric</Label>
                                <Listbox
                                    value={formData.rubric}
                                    onChange={(value) => setFormData((prevFormData) => ({ ...prevFormData, rubric: value }))}
                                >
                                    <div className="relative">
                                        <ListboxButton className="relative w-full border rounded px-2 py-1 text-left">
                                            {formData.rubric || "Select a Rubric"}
                                        </ListboxButton>
                                        <ListboxOptions className="absolute w-full mt-1 max-h-60 overflow-auto bg-white border rounded shadow-lg">
                                            {rubricNames.map((rubric) => (
                                                <ListboxOption key={rubric} value={rubric}>
                                                    {({ selected, focus }) => (
                                                        <li
                                                            className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${focus ? "text-white bg-blue-600" : "text-gray-900"
                                                                } ${selected ? "font-medium" : "font-normal"}`}
                                                        >
                                                            {rubric}
                                                        </li>
                                                    )}
                                                </ListboxOption>
                                            ))}
                                        </ListboxOptions>
                                    </div>
                                </Listbox>
                            </Field>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <Field>
                    <Label className="block text-sm font-medium text-gray-700">Title</Label>
                    <input
                        type="text"
                        name="title"
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
                        <Label className="block text-sm font-medium text-gray-700">Text</Label>
                        <TextareaAutosize
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
        </div>
    );
}