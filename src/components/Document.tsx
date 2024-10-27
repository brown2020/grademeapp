"use client";
import { useEffect, useState, useCallback, FormEvent } from "react";
import {
    collection,
    getDocs,
    Timestamp,
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
import { saveHistory } from "@/utils/saveHistory";
import { GradingData } from "@/types/grading-data";
import { UserHistoryType } from "@/types/user-history";
import { Bot, Download, Wand2 } from "lucide-react";


const fetchDocumentById = async (uid: string, id: string) => {
    const docRef = collection(db, "users", uid, "summaries");
    const docSnap = await getDocs(docRef);
    // Return the document with the given id
    return docSnap.docs.filter((doc) => doc.id === id).map((doc) => doc.data());
};

const Document = () => {
    const { uid } = useAuthStore();
    const { profile, minusCredits } = useProfileStore();
    const { summaryID, timestamp } = useParams();
    const [submissionTimestamp, setSubmissionTimestamp] = useState<Timestamp>();
    const [userDoc, setUserDoc] = useState<UserHistoryType>();
    const [loading, setLoading] = useState<boolean>(true);
    const [grade, setGrade] = useState<string>("");
    const [thinking, setThinking] = useState<boolean>(false);
    const [localCount, setLocalCount] = useState<number>(profile.credits);
    const [isStreamingComplete, setIsStreamingComplete] = useState<boolean>(false);
    const [hasSaved, setHasSaved] = useState<boolean>(false);
    const [summary, setSummary] = useState<string>("");
    const [flagged, setFlagged] = useState<string>("");
    const [active, setActive] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>("");
    const [fileUrl, setFileUrl] = useState<string>("");
    // get timestamp from path /history/${summary.id}/${submission.timestamp}

    useEffect(() => {
        const submissionTimestamp = Timestamp.fromMillis(Number(timestamp));
        setSubmissionTimestamp(submissionTimestamp);
    }, [timestamp]);


    useEffect(() => {
        const getDocument = async () => {
            try {
                const doc = await fetchDocumentById(uid as string, summaryID as string);
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

        if (uid && summaryID && submissionTimestamp) {
            toast.loading("Loading document...");
            getDocument();
        }
    }, [uid, summaryID, submissionTimestamp]);

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
        if (userDoc && submissionTimestamp) {
            // Find the submission with the matching timestamp
            const matchingSubmission = userDoc.submissions.find((sub) =>
                sub.timestamp.seconds === submissionTimestamp.seconds &&
                sub.timestamp.nanoseconds === submissionTimestamp.nanoseconds
            );
            if (matchingSubmission) {
                setGradingData({
                    title: userDoc.userInput.title,
                    text: matchingSubmission.text,
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
                setSummary(matchingSubmission.response);
                setGrade(matchingSubmission.grade);
                setFileUrl(userDoc.fileUrl);
            }

        }
    }, [userDoc, submissionTimestamp]);

    // Effect to update the active state
    useEffect(() => {
        setActive(gradingData.text.length > 1 && localCount > 0);
    }, [localCount, gradingData.text]);

    useEffect(() => {
        setLocalCount(profile.credits);
    }, [profile]);

    // Handle form submission
    const handleSubmit = useCallback(async (e: FormEvent) => {
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
        [gradingData, minusCredits, profile.credits, profile.identity, profile.identityLevel]
    );

    // Effect to handle saving to history
    useEffect(() => {
        if (isStreamingComplete && !hasSaved && summary) {

            const newSubmission = {
                text: gradingData.text,
                response: summary,
                grade,
                timestamp: Timestamp.now(),
            }

            const updatedSubmissions = userDoc?.submissions
                ? [...userDoc.submissions, newSubmission]
                : [newSubmission];

            saveHistory(uid, gradingData, updatedSubmissions, fileUrl || null).then(
                () => {
                    setHasSaved(true);
                }
            );
            toast.success("Document saved successfully", { position: "top-center" });
        }
    }, [
        isStreamingComplete,
        hasSaved,
        uid,
        summary,
        gradingData,
        grade,
        fileUrl,
        userDoc?.submissions
    ]);

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
        } else if (thinking) {
            document.getElementById("thinking")?.scrollIntoView({ behavior: "smooth" });
        } else if (flagged) {
            document
                .getElementById("flagged")
                ?.scrollIntoView({ behavior: "smooth" });
        }
    }, [summary, thinking, flagged]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!document) {
        return <div>Document not found</div>;
    }

    return (
        <div className="mb-5">
            <h1 className="font-bold text-xl">{gradingData.title}</h1>
            <h2 className="font-medium text-lg">( Grade: {grade} )</h2>
            <div className="form-wrapper">
                <form onSubmit={handleSubmit}>
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
                            maxRows={19}
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
                        <div className="flex flex-row gap-x-2">
                            {/* Submit Button */}
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={!active}
                                    className={`flex flex-row justify-between pr-2 gap-x-1 bg-primary rounded-full items-center ${active ? 'opacity-100' : 'opacity-50'}`}
                                >
                                    <Bot className=" text-primary flex place-self-center place-items-center rounded-full border-2 border-primary bg-secondary p-1.5 size-10" />
                                    <p>grade.me</p>
                                </button>

                            {fileUrl && (
                                <a href={fileUrl} target="_blank" rel="noreferrer">
                                    <div
                                        className={
                                            "flex gap-x-2 text-white font-semibold bg-accent rounded-lg px-3 py-2 justify-center items-center cursor-pointer hover:brightness-110"
                                        }
                                    >
                                        <Download size={25} />
                                        <p className="hidden sm:flex">Download</p>
                                    </div>
                                </a>
                            )}

                            <div
                                className="flex gap-x-2 text-white font-semibold bg-purple-500 rounded-lg px-3 py-1 items-center cursor-pointer hover:bg-purple-400"
                                onClick={handleFixGrammarSpelling}
                            >
                                <Wand2 size={20} />
                                <p className="hidden sm:flex">Fix Grammar & Spelling</p>
                            </div>

                        </div>
                        
                    </div>

                    {!thinking && !prompt && profile.credits < 10 && (
                        <h3>{`You don't have enough credits to grade.`}</h3>
                    )}

                    {thinking && !summary && !flagged && (
                        <div id="thinking" className="p-5">
                            <PulseLoader color="orange" size={20} loading={thinking} />
                        </div>
                    )}

                    {flagged && <h3 id="flagged">{flagged}</h3>}

                    {!flagged && summary && (
                        <div id="response" className="px-5 py-2 shadow-lg bg-blue-500/20 rounded-md h-[33vh] overflow-y-scroll">
                            {/* Render Markdown content with custom styling */}
                            <ReactMarkdown className="markdown">{summary}</ReactMarkdown>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Document;
