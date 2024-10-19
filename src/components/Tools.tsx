/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Paperclip } from "lucide-react"
import { extractGrade } from "@/utils/responseParser";
import { GradingData } from "@/types/grading-data";
import { useRubricStore } from "@/zustand/useRubricStore";



// Define types for the saveHistory function
async function saveHistory(
    uid: string | null,
    userInput: GradingData,
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
    const { selectedRubric, gradingData, setGradingData } = useRubricStore();
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
    const router = useRouter();

    // Handle file upload
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile && uid) {
            setUploading(true);
            toast.loading("Uploading file...");

            // Log file information for debugging
            // console.log('Uploading file:', selectedFile.name, 'of type:', selectedFile.type, 'and size:', selectedFile.size);

            try {
                const { setGradingData } = useRubricStore.getState();

                const fileNameWithoutExtension = ((selectedFile.name).split('.')[0]);
                setGradingData({ title: fileNameWithoutExtension });

                const fileRef = ref(storage, `uploads/${uid}/${selectedFile.name}`);
                await uploadBytes(fileRef, selectedFile);

                const downloadURL = await getDownloadURL(fileRef);
                setFileUrl(downloadURL);

                const parsedText = await parseDocumentFromUrl(downloadURL);
                setGradingData({ text: parsedText });
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
        setActive(gradingData.text.length > 1 && localCount > 0 && !uploading);
    }, [localCount, gradingData.text, uploading]);


    // Handle form submission
    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        setActive(false);
        setSummary("");
        setFlagged("");
        setThinking(true);
        setIsStreamingComplete(false);
        setHasSaved(false);

        console.log("Form Data:", gradingData);

        // convert rubric to string
        const rubricString = JSON.stringify(gradingData.rubric);
        console.log("Selected Rubric:", rubricString);

        try {
            const { result, creditsUsed } = await generateGrade(
                profile.identity || "",
                profile.identityLevel || "",
                gradingData.assigner,
                gradingData.topic,
                gradingData.prose,
                gradingData.audience,
                gradingData.wordLimitType,
                gradingData.wordLimit,                
                gradingData.title,
                gradingData.text,
                rubricString,
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
            setThinking(false);
            setIsStreamingComplete(true);
        } catch (error) {
            console.error(error);
            setThinking(false);
            setFlagged(
                "No suggestions found. Servers might be overloaded right now."
            );
        }
    }, [gradingData, profile.credits, minusCredits]);

    // Effect to handle saving to history
    useEffect(() => {
        if (isStreamingComplete && !hasSaved && summary) {
            saveHistory(uid, gradingData, summary, grade, fileUrl || null).then(() => {
                setHasSaved(true);
            });
        }
    }, [isStreamingComplete, hasSaved, summary, uid, gradingData, grade, fileUrl]);

    // Scroll into view when content changes
    useEffect(() => {
        if (summary) {
            document.getElementById("response")?.scrollIntoView({ behavior: "smooth" });
        }
        else if (flagged) {
            document.getElementById("flagged")?.scrollIntoView({ behavior: "smooth" });
        }
    }, [summary, flagged]);

    return (
        <div className="form-wrapper space-y-8 font-medium">
            <div
            onClick={() => router.push("/rubrics")}
            className="text-sm text-gray-900 px-2 py-1 bg-primary hover:bg-orange-200 border shadow rounded-lg cursor-pointer"
            >
                Selected Rubric: {selectedRubric?.name ? selectedRubric.name : "Select a rubric"}
                </div>
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <label className="block text-sm font-medium text-gray-700" htmlFor="title">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={gradingData.title}
                    onChange={(e) => setGradingData({ title: e.target.value })}
                    placeholder="Enter the title here"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
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
                    <label className="block text-sm font-medium text-gray-700" htmlFor="text">Text</label>
                    <TextareaAutosize
                        id="text"
                        name="text"
                        value={gradingData.text}
                        onChange={(e) => setGradingData({ text: e.target.value })}
                        minRows={4}
                        placeholder="Upload your text or paste it here."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!active || uploading}
                    className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {uploading ? 'Uploading...' : 'Grade'}
                </button>

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