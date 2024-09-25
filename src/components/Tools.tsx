"use client";

import { useCallback, useState, useEffect } from "react";
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

// Define types for the saveHistory function
async function saveHistory(
    uid: string | null,
    prompt: string,
    response: string,
    topic: string,
    title: string,
    grade: string,
    fileUrl: string | null
): Promise<void> {
    if (!uid) return;

    const docRef = doc(collection(db, "users", uid, "summaries"));
    await setDoc(docRef, {
        id: docRef.id,
        prompt,
        response,
        topic,
        title,
        grade,
        fileUrl,
        timestamp: Timestamp.now(),
    });
    console.log("History saved successfully.");
}

export default function Tools() {
    const { uid } = useAuthStore();
    const { profile, minusCredits } = useProfileStore();
    const [prompt, setPrompt] = useState<string>("");
    const [summary, setSummary] = useState<string>("");
    const [flagged, setFlagged] = useState<string>("");
    const [active, setActive] = useState<boolean>(false);
    const [topic, setTopic] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [grade, setGrade] = useState<string>("");
    const [words, setWords] = useState<string>("");
    const [thinking, setThinking] = useState<boolean>(false);
    const [localCount, setLocalCount] = useState<number>(profile.credits);
    const [isStreamingComplete, setIsStreamingComplete] = useState<boolean>(false);
    const [hasSaved, setHasSaved] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);
    const [fileUrl, setFileUrl] = useState<string>("");


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile) {
            setUploading(true);
            setTitle((selectedFile.name).split('.')[0]); // Set the title to the file name

            // Firebase Storage logic to upload the file
            try {
                const fileRef = ref(storage, `uploads/${uid}/${selectedFile.name}`);
                await uploadBytes(fileRef, selectedFile);
                const downloadURL = await getDownloadURL(fileRef);
                setFileUrl(downloadURL); // Store the URL to use it later

                // Call the Server Action to parse the document using the file URL
                const parsedText = await parseDocumentFromUrl(downloadURL);
                setTopic(parsedText); // Set the parsed text as the topic
            } catch (error) {
                console.error('Failed to upload file:', error);
                // Handle error with error message, etc. Toast?
            } finally {
                setUploading(false);
            }
        }
    };

    // Effect to update the active state
    useEffect(() => {
        setActive(topic.length > 1 && localCount > 0);
    }, [localCount, topic]);

    // Handle form submission
    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
            e.preventDefault();
            setActive(false);
            setSummary("");
            setFlagged("");
            setThinking(true);
            setIsStreamingComplete(false);
            setHasSaved(false);

            try {
                const userPrompt = `Please grade the essay that follows: \n${topic}`;
                const { result, creditsUsed } = await generateGrade(topic, words, profile.credits);

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
                setPrompt(userPrompt);
                setThinking(false);
                setIsStreamingComplete(true);
            } catch (error) {
                console.error(error);
                setThinking(false);
                setFlagged(
                    "No suggestions found. Servers might be overloaded right now."
                );
            }
        },
        [topic, words, minusCredits, profile.credits]
    );

    // Effect to handle saving to history
    useEffect(() => {
        if (isStreamingComplete && !hasSaved && summary) {
            saveHistory(uid, prompt, summary, topic, title, grade, fileUrl || null).then(() => {
                setHasSaved(true);
            });
        }
    }, [isStreamingComplete, hasSaved, summary, uid, prompt, topic, title, grade, fileUrl]);

    // Scroll into view when content changes
    useEffect(() => {
        if (summary) {
            document
                .getElementById("response")?.scrollIntoView({ behavior: "smooth" });
        } else if (prompt) {
            document.getElementById("prompt")?.scrollIntoView({ behavior: "smooth" });
        } else if (flagged) {
            document.getElementById("flagged")?.scrollIntoView({ behavior: "smooth" });
        }
    }, [summary, prompt, flagged]);

    return (
        <div className="form-wrapper">
            <form onSubmit={handleSubmit}>

                <label htmlFor="file-upload">
                    Upload Document
                    <input
                        type="file"
                        id="file-upload"
                        accept=".docx,.pdf,.odt,.txt"
                        onChange={handleFileChange}
                    />
                </label>
                {uploading && <p>Uploading...</p>}

                <label htmlFor="title-field">
                    Title
                    <input
                        type="text"
                        id="title-field"
                        placeholder="Enter the title here."
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />
                </label>

                <label htmlFor="topic-field">
                    Text
                    <TextareaAutosize
                        id="topic-field"
                        minRows={4}
                        placeholder="Upload your essay or paste it here."
                        onChange={(e) => setTopic(e.target.value)}
                        value={topic}
                    />
                </label>

                <label htmlFor="words-field">
                    Class level (Middle school, high school, college, etc.)
                    <input
                        type="text"
                        id="words-field"
                        placeholder="Enter the class level here."
                        onChange={(e) => setWords(e.target.value)}
                        value={words}
                    />
                </label>

                <div className="flex flex-row gap-10">
                    <button className="bottom flex" type="submit" disabled={!active || uploading}>
                        {uploading ? 'Uploading...' : 'Grade'}
                    </button>
                    <div className="flex">
                        <h3 className="text-gray-500 font-medium">{`Credits: ${localCount}`}</h3>
                    </div>
                </div>

                {!thinking && !prompt && profile.credits < 10 && (
                    <h3>{`You don't have enough credits to grade.`}</h3>
                )}

                {thinking && !summary && !flagged && (
                    <div className="p-5">
                        <PulseLoader color="red" size={20} loading={thinking} />
                    </div>
                )}

                {flagged && <h3 id="flagged">{flagged}</h3>}

                {!flagged && summary && (
                    <div className="px-5 py-2 shadow-lg bg-orange-200 rounded-md">
                        {/* Render Markdown content with custom styling */}
                        <ReactMarkdown className="markdown">{summary}</ReactMarkdown>
                    </div>
                )}
            </form>
        </div>
    );
}