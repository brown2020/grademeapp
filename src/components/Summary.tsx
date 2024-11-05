"use client";
import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useParams } from "next/navigation";
import { UserHistoryType, Submission } from "@/types/user-history";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import RubricDisplay from "@/components/rubrics/RubricDisplay";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDown, Download } from "lucide-react";
import { RubricState, BaseRubric } from "@/types/rubrics-types";

// Fetch summary by ID
const fetchSummaryById = async (uid: string, id: string) => {
    const docRef = collection(db, "users", uid, "summaries");
    const docSnap = await getDocs(docRef);
    const summaryDoc = docSnap.docs.find((doc) => doc.id === id);
    return summaryDoc ? (summaryDoc.data() as UserHistoryType) : undefined;
};

const Summary = () => {
    const { uid } = useAuthStore();
    const { summaryID } = useParams();
    const [summary, setSummary] = useState<UserHistoryType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [rubric, setRubric] = useState<BaseRubric | null>(null);

    useEffect(() => {
        const getSummary = async () => {
            try {
                setLoading(true);
                toast.loading("Loading summary...");
                const summaryData = await fetchSummaryById(uid as string, summaryID as string);
                setSummary(summaryData || null);
                setRubric(summaryData?.userInput?.rubric as unknown as BaseRubric || null);
            } catch (error) {
                console.error("Error in getSummary", error);
                toast.error("Failed to load the summary.", { id: "loading" });
            } finally {
                setLoading(false);
                toast.dismiss();
                toast.success("Summary loaded successfully", { id: "loading" });
            }
        };

        if (uid && summaryID) {
            getSummary();
        }
    }, [uid, summaryID]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!summary) {
        return <div>Summary not found</div>;
    }

    console.log(summary);

    return (
        <div className="flex flex-col gap-y-4 p-1 max-w-2xl mx-auto">
            {/* Title, Topic, and Rubric */}
            <div>
                <h1>Summary</h1>
                <hr />
            </div>
            <h2>Title: {summary.userInput.title}</h2>
            <p className="text-lg"><strong>Topic: </strong> {summary.userInput.topic}</p>
            {/* File Download Button */}
            {summary.fileUrl && (
                <a href={summary.fileUrl} target="_blank" rel="noreferrer" className="w-full">
                    <div
                        className={
                            "btn btn-shiny btn-shiny-teal w-full gap-x-4 text-lg py-1"
                        }
                    >
                        <Download />
                        <p>Download</p>
                    </div>
                </a>
            )}
            {/* Rubric Display */}
            <h2 className=" font-semibold">{rubric?.name}</h2>
            <p className="text-sm">{rubric?.description}</p>
            <RubricDisplay rubric={rubric as RubricState} />

            {/* Accordion for Submissions */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Submissions</h2>

                {summary.submissions.length === 0 ? (
                    <p>No submissions yet</p>
                ) : (
                    summary.submissions.map((submission: Submission, index: number) => (
                        <Disclosure key={index}>
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="btn btn-shiny btn-shiny-teal text-primary-95 w-full mb-3 px-2 justify-between">
                                        <span>
                                            #{index + 1} - {submission.timestamp.toDate().toLocaleDateString('en-US')}
                                        </span>
                                        <span>Grade: {submission.grade}</span>
                                        <Link href={`/history/${summaryID}/${submission.timestamp.toMillis()}`}>
                                            <p className=" px-3 py-2 underline underline-offset-4">
                                                Revise and Edit
                                            </p>
                                        </Link>
                                        <ChevronDown className={`${open ? "transform rotate-180" : ""} w-5 h-5 duration-300 ease-in-out transition`} />
                                    </DisclosureButton>

                                    <DisclosurePanel transition className="bg-secondary-97 ring ring-primary-40 rounded-lg ring-inset p-2 text-sm origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0 mb-2">
                                        {/* Submitted Text */}
                                        <div className="mb-4">
                                            <h4 className="font-semibold">Submitted Text</h4>
                                            <div className="p-3 rounded h-96 overflow-y-auto">
                                                <ReactMarkdown>{submission.text || "No text submitted"}</ReactMarkdown>
                                            </div>
                                        </div>

                                        {/* Feedback */}
                                        <div className="">
                                            <h4 className="font-semibold">Feedback</h4>
                                            <div className="bg-blue-500/20 p-3 rounded h-96 overflow-y-auto">
                                                <ReactMarkdown>{submission.response}</ReactMarkdown>
                                            </div>
                                        </div>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>
                    ))
                )}
            </div>
        </div>
    );
};

export default Summary;
