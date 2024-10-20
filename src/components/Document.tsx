"use client";
import { useEffect, useState, useCallback } from "react";
import {
    collection,
    getDocs,
    Timestamp,
    doc,
    // setDoc,
    updateDoc,
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
import { GradingData } from "@/types/grading-data";
import { UserHistoryType } from "@/types/user-history";

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
    await updateDoc(docRef, {
        id: docRef.id,
        userInput,
        response,
        grade,
        fileUrl,
        timestamp: Timestamp.now(),
    });
    console.log("History saved successfully.");
}

const fetchDocumentById = async (uid: string, id: string) => {
    const docRef = collection(db, "users", uid, "summaries");
    const docSnap = await getDocs(docRef);
    // Return the document with the given id
    return docSnap.docs.filter((doc) => doc.id === id).map((doc) => doc.data());
};

const Document = () => {
    const { uid } = useAuthStore();
    const { profile, minusCredits } = useProfileStore();
    const { docID } = useParams();
    const [userDoc, setUserDoc] = useState<UserHistoryType>();
    const [loading, setLoading] = useState<boolean>(true);
    const [grade, setGrade] = useState<string>("");
    const [thinking, setThinking] = useState<boolean>(false);
    const [localCount, setLocalCount] = useState<number>(profile.credits);
    const [isStreamingComplete, setIsStreamingComplete] =
        useState<boolean>(false);
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
                setUserDoc(doc[0] as UserHistoryType);
                toast.dismiss();
                toast.success("Document loaded successfully", { id: "loading" });
            } catch (error) {
                console.error("Error in getDocument", error);
                toast.error("Failed to load document");
            } finally {
                setLoading(false);
            }
        };

        if (uid && docID) {
            getDocument(); // Trigger document fetch only if both uid and docID exist
        }
    }, [uid, docID]);

    console.log(userDoc);

    const [gradingData, setGradingData] = useState<GradingData>({
        title: "",
        text: "",
        assigner: "",
        textType: "",
        topic: "",
        prose: "",
        audience: "",
        wordLimitType: "less than",
        wordLimit: "",
        customRubric: "",
        rubric: "",
    });

    useEffect(() => {
        if (userDoc) {
            setGradingData({
                title: userDoc.userInput.title,
                text: userDoc.userInput.text,
                assigner: userDoc.userInput.assigner,
                textType: userDoc.userInput.textType,
                topic: userDoc.userInput.topic,
                prose: userDoc.userInput.prose,
                audience: userDoc.userInput.audience,
                wordLimitType: userDoc.userInput.wordLimitType as
                    | "less than"
                    | "more than"
                    | "between",
                wordLimit: userDoc.userInput.wordLimit,
                customRubric: userDoc.userInput.customRubric,
                rubric: userDoc.userInput.rubric,
            });
            setSummary(userDoc.response);
            setGrade(userDoc.grade);
            setFileUrl(userDoc.fileUrl);
        }
    }, [userDoc]);

    // Effect to update the active state
    useEffect(() => {
        setActive(gradingData.text.length > 1 && localCount > 0);
    }, [localCount, gradingData.text]);

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
                const {
                    assigner,
                    topic,
                    prose,
                    audience,
                    wordLimitType,
                    wordLimit,
                    title,
                    rubric,
                    text,
                } = gradingData;

                const { result, creditsUsed } = await generateGrade(
                    profile.identity || "",
                    profile.identityLevel || "",
                    assigner,
                    topic,
                    prose,
                    audience,
                    wordLimitType,
                    wordLimit,
                    rubric,
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
        [gradingData, minusCredits, profile.credits]
    );

    // Effect to handle saving to history
    useEffect(() => {
        if (isStreamingComplete && !hasSaved && summary) {
            saveHistory(uid, gradingData, summary, grade, fileUrl || null).then(
                () => {
                    setHasSaved(true);
                }
            );
            toast.success("Document saved successfully");
        }
    }, [
        isStreamingComplete,
        hasSaved,
        summary,
        uid,
        gradingData,
        grade,
        fileUrl,
    ]);

    // Handle saving the document
    const handleSave = async () => {
        toast.loading("Saving document...");
        await saveHistory(uid, gradingData, summary, grade, fileUrl || null);
        toast.dismiss();
        toast.success("Document saved successfully");
    };

    // Handle fixing grammar and spelling
    const handleFixGrammarSpelling = async () => {
        setActive(false);
        setSummary("");
        setFlagged("");
        setThinking(true);
        setIsStreamingComplete(false);
        setHasSaved(false);

        try {
            const { correctedTextArray, totalCreditsUsed } =
                await correctGrammarAndSpelling(gradingData.text, profile.credits);
            const finalText = correctedTextArray.join("");
            console.log(finalText);

            if (!finalText) throw new Error("No response");

            const creditsDeducted = await minusCredits(totalCreditsUsed);

            if (!creditsDeducted) {
                throw new Error("Failed to deduct credits.");
            }

            setSummary(finalText);
            setGradingData((prev) => ({ ...prev, text: finalText }));

            setLocalCount((prev) => prev - totalCreditsUsed);
            setPrompt(`Here is the corrected text: \n${gradingData.text}`);
            setThinking(false);
            setIsStreamingComplete(true);
        } catch (error) {
            console.error(error);
            setThinking(false);
            setFlagged(
                "No suggestions found. Servers might be overloaded right now."
            );
        }
    };

    // Scroll into view when content changes
    useEffect(() => {
        if (summary) {
            document
                .getElementById("response")
                ?.scrollIntoView({ behavior: "smooth" });
        } else if (prompt) {
            document.getElementById("prompt")?.scrollIntoView({ behavior: "smooth" });
        } else if (flagged) {
            document
                .getElementById("flagged")
                ?.scrollIntoView({ behavior: "smooth" });
        }
    }, [summary, prompt, flagged]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!document) {
        return <div>Document not found</div>;
    }

    return (
        <div className="form-wrapper">
            <form onSubmit={handleSubmit}>
                <h1 className="font-bold text-3xl">{gradingData.title}</h1>
                <h2 className="font-medium text-2xl">( Grade: {grade} )</h2>
                <label htmlFor="title-field">
                    Title
                    <input
                        type="text"
                        id="title-field"
                        placeholder="Enter the title here."
                        onChange={(e) =>
                            setGradingData((prevFormData) => ({
                                ...prevFormData,
                                title: e.target.value,
                            }))
                        }
                        value={gradingData.title}
                    />
                </label>

                <label htmlFor="text-field">
                    Text
                    <TextareaAutosize
                        id="text-field"
                        minRows={4}
                        maxRows={20}
                        placeholder="Upload your essay or paste it here."
                        onChange={(e) =>
                            setGradingData((prevFormData) => ({
                                ...prevFormData,
                                text: e.target.value,
                            }))
                        }
                        value={gradingData.text}
                    />
                </label>

                <div className="flex flex-row justify-between gap-10">
                    <div className="flex flex-row gap-4">
                        <button
                            className={
                                "flex text-white font-semibold bg-orange-500 rounded-lg px-4 py-1 items-center"
                            }
                            type="submit"
                            disabled={!active}
                        >
                            Grade
                        </button>
                        <div
                            className="flex text-white px-4 py-1 items-center bg-green-500 rounded-lg font-semibold cursor-pointer hover:bg-green-400"
                            onClick={handleSave}
                        >
                            Save
                        </div>
                        {fileUrl && (
                            <a href={fileUrl} target="_blank" rel="noreferrer">
                                <div
                                    className={
                                        "flex text-white font-semibold bg-blue-500 rounded-lg px-4 py-2 items-center cursor-pointer hover:bg-blue-400"
                                    }
                                >
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
    );
};

export default Document;
