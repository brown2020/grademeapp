"use client";

import { useEffect, useState, useCallback } from "react";
import {
    collection,
    getDocs,
    deleteDoc,
    limit,
    orderBy,
    query,
    startAfter,
    Timestamp,
    doc,
    updateDoc,
    DocumentData,
    QueryDocumentSnapshot
    // deleteDoc,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import Link from "next/link";
import { PlusCircle, Search, XCircle } from "lucide-react";
// import { getExcerpt } from "@/utils/responseParser";
import { UserHistoryType } from "@/types/user-history";
import { useRouter } from "next/navigation";

interface DebounceFunction {
    (func: (value: string) => void, delay: number): (value: string) => void;
}

// Function to handle document migration
const migrateDocumentIfNeeded = async (summaryDoc: QueryDocumentSnapshot<DocumentData, DocumentData>, uid: string, docId: string) => {
    const summaryData = summaryDoc.data();
    if (!summaryData.submissions) {
        const newSubmissions = [
            {
                text: summaryData.text ?? "",
                response: summaryData.response ?? "",
                grade: summaryData.grade ?? "",
                timestamp: summaryData.timestamp ?? new Date(),
            }
        ];

        const updatedSummary = {
            submissions: newSubmissions,
            userInput: summaryData.userInput ?? {},
            fileUrl: summaryData.fileUrl ?? "",
            timestamp: summaryData.timestamp ?? new Date(),
        };

        await updateDoc(doc(db, "users", uid, "summaries", docId), updatedSummary);
    }
};

export default function History() {
    const { uid } = useAuthStore();
    const [summaries, setSummaries] = useState<UserHistoryType[]>([]);
    const [search, setSearch] = useState<string>("");
    const [lastKey, setLastKey] = useState<Timestamp | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const orderedSummaries = summaries
        .slice()
        .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

    const debounce: DebounceFunction = (func, delay) => {
        let timeout: NodeJS.Timeout;
        return (value: string) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(value), delay);
        };
    };

    const handleSearchChange = debounce((value: string) => setSearch(value), 300);

    const handleDelete = async (e: React.MouseEvent<SVGElement>) => {
        const summaryId = e.currentTarget.getAttribute("data-summary-id");

        if (!uid || !summaryId) {
            throw new Error("User ID or summary ID is missing");
        }

        try {
            // Get a reference to the specific document in the summaries subcollection
            const summaryDocRef = doc(db, "users", uid, "summaries", summaryId);

            // Delete the document
            await deleteDoc(summaryDocRef);

            // Update the state to remove the deleted summary
            setSummaries((prev) =>
                prev.filter((summary) => summary.id !== summaryId)
            );
            toast.success("Document deleted successfully");
            return true;
        } catch (error) {
            toast.error("An error occurred while deleting the summary");
            console.error("Error deleting document:", error);
            return false;
        }
    };

    // Memoize fetchHistory using useCallback
    const fetchHistory = useCallback(
        async (startAfterKey?: Timestamp) => {
            if (uid && !loading) {
                setLoading(true);
                const id = toast.loading("Loading history...", { position: "top-center" });
                try {
                    const c = collection(db, "users", uid, "summaries");
                    const q = startAfterKey
                        ? query(
                            c,
                            orderBy("timestamp", "desc"),
                            startAfter(startAfterKey),
                            limit(100)
                        )
                        : query(c, orderBy("timestamp", "desc"), limit(100));

                    const querySnapshot = await getDocs(q);
                    const newSummaries: UserHistoryType[] = [];

                    for (const summaryDoc of querySnapshot.docs) {
                        const docId = summaryDoc.id;
                        await migrateDocumentIfNeeded(summaryDoc, uid, docId);

                        const summaryData = summaryDoc.data();
                        newSummaries.push({
                            id: docId,
                            fileUrl: summaryData.fileUrl,
                            submissions: summaryData.submissions ?? [],
                            userInput: summaryData.userInput,
                            timestamp: summaryData.timestamp,
                        });
                    }

                    setSummaries((prev) => [...prev, ...newSummaries]);
                    setLastKey(
                        querySnapshot.docs[querySnapshot.docs.length - 1]?.data().timestamp
                    );
                    toast.success("History loaded successfully", { id, position: "top-center" });
                } catch (error) {
                    toast.error("Error loading history");
                    console.error("Error fetching summaries:", error);
                } finally {
                    toast.dismiss(id);
                    setLoading(false);
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [uid]
    );

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        fetchHistory();
    }, [uid, fetchHistory]);

    const postsNextBatch = async () => {
        if (lastKey) {
            await fetchHistory(lastKey);
        }
    };

    if (!uid) return <div>Not signed in</div>;

    return (
        <div className="flex flex-col gap-y-2">
            <div>
                <h1 className="text-xl font-bold text-left text-primary">Assignments</h1>
                <hr className="border border-primary" />
            </div>

            <Link href={'/grademe'} className="bg-accent text-primary-foreground flex flex-row gap-x-2 items-center rounded-lg h-10 px-3 justify-center w-fit">
                <PlusCircle size={20} className="flex" />
                <p className="flex text-center">Grade New Assignment</p>
            </Link>

            <div className="flex flex-row items-center px-3 bg-secondary focus:ring-1 ring-accent rounded-full w-full ring-offset-1">
                <Search size={20} className="flex text-primary" />
                <input
                    className="px-3 h-8 bg-secondary outline-none placeholder:text-primary"
                    type="text"
                    placeholder="Find an assignment..."
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
            </div>

            <div>
                <h2 className="text-primary text-left font-medium text-lg">Recent Assignments</h2>
                <hr className="border-0.5 border-accent mb-2" />
            </div>
            <div className="flex flex-col space-y-3">
                {orderedSummaries
                    .filter((summary) =>
                        summary.submissions.length > 0 &&
                        `${summary.submissions[0].text ?? ""} ${summary.userInput?.title ?? ""} ${summary.submissions[0].response ?? ""}`
                            .toUpperCase()
                            .includes(search ? search.toUpperCase() : "")
                    )
                    .map((summary, index) => (
                        <div
                            key={`${summary.id}-${summary.timestamp.seconds}-${index}`}
                            className="flex flex-col px-2 py-1 rounded-lg shadow-md bg-secondary"
                        >

                            <div className="flex flex-col justify-between items-baseline w-full">
                                <div className="flex flex-row text-primary w-full font-medium cursor-pointer">
                                    <p
                                        className="truncate underline"
                                        onClick={() => { router.push(`/history/${summary.id}`) }}
                                    >
                                        {summary.userInput?.title ?? "No title available"}
                                    </p>
                                    <XCircle
                                        size={20}
                                        className="flex ml-auto text-red-800 cursor-pointer"
                                        onClick={handleDelete}
                                        data-summary-id={summary.id}
                                    />
                                </div>
                                <div className="flex flex-row w-full justify-between mb-1">
                                    <div className="flex text-xs">
                                        Current Grade: {summary.submissions[summary.submissions.length - 1]?.grade ?? "N/A"}
                                    </div>
                                    <div className="flex text-xs">{summary.submissions.length} Resubmissions</div>
                                </div>
                            </div>
                            <div>
                                <hr className="border-0.5 border-accent" />
                                <div className="flex flex-col gap-y-2">
                                    {summary.submissions.map((submission, i) => (
                                        <div key={i} className="text-sm flex flex-row gap-x-2 justify-between">
                                            <p>#{i + 1} </p>
                                            <p>Grade: {submission.grade}</p>
                                            <p>{submission.timestamp.toDate().toLocaleDateString('en-US')}</p>
                                            <p
                                                className="cursor-pointer underline font-medium"
                                                onClick={() => { router.push(`/history/${summary.id}/${submission.timestamp.toMillis()}`) }}
                                            >View Feedback</p>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    ))}
            </div>
            {lastKey && (
                <button
                    className="my-3 px-4 py-2 bg-accent text-white rounded-md"
                    onClick={postsNextBatch}
                >
                    Load More
                </button>
            )}
        </div>
    );
}
