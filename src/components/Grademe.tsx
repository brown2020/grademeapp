/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCallback, useState, useEffect, FormEvent } from "react";
import { Timestamp } from "firebase/firestore";
import { storage } from "@/firebase/firebaseClient";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore from "@/zustand/useProfileStore";
import { PulseLoader } from "react-spinners";
import { generateGrade } from "@/actions/generateResponse";
import { parseDocumentFromUrl } from "@/actions/parseDocumentFromUrl";
import { readStreamableValue } from "ai/rsc";
import ReactMarkdown from "react-markdown";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { FileSearch, Paperclip, Bot } from "lucide-react"
import { extractGrade } from "@/utils/responseParser";
import { saveHistory } from "@/utils/saveHistory";
import { useRubricStore } from "@/zustand/useRubricStore";
import CustomButton from "@/components/ui/CustomButton";
import Tiptap from "@/components/ui/Tiptap";

export default function Grademe() {
    const { uid } = useAuthStore();
    const { selectedRubric, gradingData, setGradingData } = useRubricStore();
    const { profile, minusCredits } = useProfileStore();
    const [response, setResponse] = useState<string>("");
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
            toast.loading("Uploading file...", { position: "top-center" });

            // Log file information for debugging
            console.log('Uploading file:', selectedFile.name, 'of type:', selectedFile.type, 'and size:', selectedFile.size);

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
                toast.error('Failed to upload file. Please try again.', { position: "top-center" });
            } finally {
                setUploading(false);
                toast.dismiss();
                toast.success('File uploaded successfully.', { position: "top-center" });
            }
        } else if (!uid) {
            toast.error('Please log in to upload a file.', { position: "top-center" });
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
        setResponse("");
        setFlagged("");
        setThinking(true);
        setIsStreamingComplete(false);
        setHasSaved(false);

        // convert rubric to string
        const rubricString = JSON.stringify(gradingData.rubric);

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
                    setResponse(content.trim());
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
    }, [gradingData, profile.credits, minusCredits, profile.identity, profile.identityLevel]);

    // Effect to handle saving to history
    useEffect(() => {
        if (isStreamingComplete && !hasSaved && response) {
            console.log(fileUrl)
            saveHistory(uid, gradingData, [{ text: gradingData.text, response: response, grade, timestamp: Timestamp.now() }], fileUrl).then(() => {
                setHasSaved(true);
            });
        }
    }, [isStreamingComplete, hasSaved, response, uid, gradingData, grade, fileUrl]);

    // Scroll into view when content changes
    useEffect(() => {
        if (response) {
            document.getElementById("response")?.scrollIntoView({ behavior: "smooth" });
        }
        else if (flagged) {
            document.getElementById("flagged")?.scrollIntoView({ behavior: "smooth" });
        } else if (thinking) {
            document.getElementById("thinking")?.scrollIntoView({ behavior: "smooth" });
        } else if (uploading == false) {
            document.getElementById("grademe")?.scrollIntoView({ behavior: "smooth" });
        }
    }, [response, flagged, thinking, uploading]);

    return (
        <>
            <h1 className="text-xl font-bold text-left text-primary">Selected Rubric</h1>
            <hr className="border border-accent mb-2" />
            <div className="flex flex-col gap-y-4">
                <div
                    onClick={() => router.push("/rubrics")}
                    className="text-sm font-semibold px-2 py-1 bg-accent text-primary-foreground shadow rounded-lg cursor-pointer"
                >
                    {selectedRubric?.name ? selectedRubric.name : "Select a rubric"}
                </div>
                <CustomButton onClick={() => setTimeout(() => router.push("/rubrics"), 300)} className="btn-test">
                    <FileSearch />
                    <p>Explore Rubrics</p>
                </CustomButton>
                <form className="flex flex-col gap-y-2" onSubmit={handleSubmit}>
                    {/* Title */}
                    <section>
                        <label className="block text-primary font-medium" htmlFor="title">Title</label>
                        <hr className="border border-accent mb-2" />
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={gradingData.title}
                            onChange={(e) => setGradingData({ title: e.target.value })}
                            placeholder="Enter the title here"
                            className="mt-1 block w-full rounded-md bg-secondary px-2 py-1 shadow-sm focus:border-accent focus:ring-accent sm:text-sm placeholder:text-primary"
                        />
                    </section>
                    {/* Text Editor and File Upload */}
                    <section>
                        <div className="relative">
                            <label className="block font-medium text-primary" htmlFor="text">Text</label>
                            <hr className="border border-accent mb-2" />
                            <Tiptap
                                wordLimit={gradingData.wordLimit}
                                wordLimitType={gradingData.wordLimitType}
                                editorContent={gradingData.text}
                                onChange={(text) => setGradingData({ text })}
                            />
                        </div>
                    </section>

                    <section className="flex flex-row items-center gap-x-4">
                        {/* Submit Button */}
                        <div className={`flex flex-row bg-primary  rounded-full items-center ${active ? 'opacity-100' : 'opacity-50'}`}>
                            <button
                                type="submit"
                                id="grademe"
                                onClick={handleSubmit}
                                disabled={!active || uploading}
                                className={`inline-flex justify-center items-center gap-x-2 rounded-md border-transparent text-primary-foreground mr-2`}
                            >
                                <Bot className=" text-primary flex place-self-center place-items-center rounded-full border-2 border-primary bg-secondary p-1.5 size-10" />
                                {uploading ? 'Uploading...' : 'grade.me'}
                            </button>
                        </div>
                        {/* File Upload */}
                        <div className="flex group items-center relative bg-secondary border-2 border-primary rounded-full p-1.5">
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-row items-center justify-center">
                                <Paperclip size={25} className="flex place-self-center place-items-center text-primary" />
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
                            <div className="absolute left-11 w-32 px-2 py-1 bg-accent text-primary-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Upload a file (docx, pdf, odt, txt)
                            </div>
                        </div>
                    </section>

                </form>
                {thinking && <PulseLoader id="thinking" color="orange" size={20} />}

                {response && (
                    <div id="response" className="px-5 py-2 shadow-lg bg-blue-500/20 rounded-md">
                        <ReactMarkdown>{response}</ReactMarkdown>
                    </div>
                )}
            </div>
        </>
    );
}