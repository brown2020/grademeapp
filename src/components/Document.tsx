"use client";
import { useEffect, useState, useCallback } from "react";
import {
    collection,
    getDocs,
    Timestamp,
    doc,
    setDoc,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore from "@/zustand/useProfileStore";
import { useParams } from "next/navigation";
import { generateGrade } from "@/actions/generateResponse";
import { readStreamableValue } from "ai/rsc";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import { PulseLoader } from "react-spinners";
import { correctGrammarAndSpelling } from "@/actions/correctGrammarSpelling";
import { extractGrade } from "@/utils/responseParser";

type DocumentType = {
    timestamp: Timestamp;
    prompt: string;
    response: string;
    topic: string;
    title: string;
    grade: string;
    fileUrl: string;
    id: string;
};

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
    console.log("Document saved successfully.");
}

const fetchDocumentById = async (uid: string, id: string) => {
    const docRef = collection(db, "users", uid, "summaries");
    const docSnap = await getDocs(docRef);
    // Return the document with the given id
    return docSnap.docs.filter((doc) => doc.id === id).map((doc) => doc.data());
}

const Document = () => {
    const { uid } = useAuthStore();
    const { profile, minusCredits } = useProfileStore();
    const { docID } = useParams();
    const [userDoc, setUserDoc] = useState<DocumentType>();
    const [loading, setLoading] = useState<boolean>(true);
    const [topic, setTopic] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [grade, setGrade] = useState<string>("");
    const [words, setWords] = useState<string>("");
    const [thinking, setThinking] = useState<boolean>(false);
    const [localCount, setLocalCount] = useState<number>(profile.credits);
    const [isStreamingComplete, setIsStreamingComplete] = useState<boolean>(false);
    const [hasSaved, setHasSaved] = useState<boolean>(false);
    const [summary, setSummary] = useState<string>("");
    const [flagged, setFlagged] = useState<string>("");
    const [active, setActive] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>("");
    const [fileUrl, setFileUrl] = useState<string>("");

    useEffect(() => {
        const getDocument = async () => {
            try {
                toast.loading("Loading document...");
                const doc = await fetchDocumentById(uid as string, docID as string);
                setUserDoc(doc[0] as DocumentType);
                toast.dismiss();
                toast.success("Document loaded successfully", { id: "loading" });
            } catch (error) {
                toast.error("Failed to load document");
            } finally {
                setLoading(false);
            }
        };

        if (uid && docID) {
            getDocument(); // Trigger document fetch only if both uid and docID exist
        }
    }, [uid, docID]);

    useEffect(() => {
        if (userDoc) {
            setTitle(userDoc.title || "");
            setGrade(userDoc.grade || "");
            setTopic(userDoc.topic || "");
            setFileUrl(userDoc.fileUrl || "");
        }
    }, [userDoc])

    // Effect to update the active state
    useEffect(() => {
        setActive(topic.length > 1 && localCount > 0);
    }, [localCount, topic]);

    useEffect(() => {
        setLocalCount(profile.credits);
    }, [profile]);

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
            toast.success("Document saved successfully");
        }
    }, [isStreamingComplete, hasSaved, summary, uid, prompt, topic, title, grade, fileUrl]);

    // Handle saving the document
    const handleSave = async () => {
        toast.loading("Saving document...");
        await saveHistory(uid, prompt, summary, topic, title, grade, fileUrl || null);
        toast.dismiss();
        toast.success("Document saved successfully");
    }

    // Handle fixing grammar and spelling
    const handleFixGrammarSpelling = async () => {
        setActive(false);
        setSummary("");
        setFlagged("");
        setThinking(true);
        setIsStreamingComplete(false);
        setHasSaved(false);

        try {
            const { correctedTextArray, totalCreditsUsed } = await correctGrammarAndSpelling(topic, profile.credits);
            const finalText = correctedTextArray.join("");
            console.log(finalText)

            if (!finalText) throw new Error("No response");

            const creditsDeducted = await minusCredits(totalCreditsUsed);

            if (!creditsDeducted) {
                throw new Error("Failed to deduct credits.");
            }

            setSummary(finalText);
            setTopic(finalText);

            setLocalCount((prev) => prev - totalCreditsUsed);
            setPrompt(`Here is the corrected text: \n${topic}`);
            setThinking(false);
            setIsStreamingComplete(true);
        } catch (error) {
            console.error(error);
            setThinking(false);
            setFlagged(
                "No suggestions found. Servers might be overloaded right now."
            );
        }
    }

    // Scroll into view when content changes
    // useEffect(() => {
    //     if (summary) {
    //         document.getElementById("response")?.scrollIntoView({ behavior: "smooth" });
    //     } else if (prompt) {
    //         document.getElementById("prompt")?.scrollIntoView({ behavior: "smooth" });
    //     } else if (flagged) {
    //         document.getElementById("flagged")?.scrollIntoView({ behavior: "smooth" });
    //     }
    // }, [summary, prompt, flagged]);

    if (loading) {
        return <div>Loading...</div>
    }

    if (!document) {
        return <div>Document not found</div>
    }

    return (
        <div className="form-wrapper">
            <form onSubmit={handleSubmit}>
                <h1 className="font-bold text-3xl">{title}</h1>
                <h2 className="font-medium text-2xl">( Grade: {grade} )</h2>
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
                        maxRows={20}
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

                <div className="flex flex-row justify-between gap-10">
                    <div className="flex flex-row gap-4">
                        <button className={"flex text-white font-semibold bg-orange-500 rounded-lg px-4 py-1 items-center"}
                            type="submit"
                            disabled={!active}
                        >
                            Grade
                        </button>
                        <div className="flex text-white px-4 py-1 items-center bg-green-500 rounded-lg font-semibold cursor-pointer hover:bg-green-400"
                            onClick={handleSave}
                        >
                            Save
                        </div>
                        {fileUrl && (
                            <a href={fileUrl} target="_blank" rel="noreferrer">
                                <div className={"flex text-white font-semibold bg-blue-500 rounded-lg px-4 py-2 items-center cursor-pointer hover:bg-blue-400"}>
                                    Download
                                </div>
                            </a>
                        )}
                        <div
                            className="flex text-white font-semibold bg-purple-500 rounded-lg px-4 py-2 items-center cursor-pointer hover:bg-purple-400"
                            onClick={handleFixGrammarSpelling}
                        >
                            Fix Grammar & Spelling
                        </div>
                    </div>
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
    )
}

export default Document