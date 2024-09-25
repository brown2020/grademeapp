"use client";

import { useEffect, useState, useCallback } from "react";
import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    Timestamp,
    doc,
    deleteDoc
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import Link from "next/link";
import { FileX } from "lucide-react";
import { getExcerpt } from "@/utils/responseParser";

type UserHistoryType = {
    timestamp: Timestamp;
    prompt: string;
    response: string;
    topic: string;
    title: string;
    grade: string;
    id: string;
};

interface DebounceFunction {
    (func: (value: string) => void, delay: number): (value: string) => void;
}

export default function History() {
    const { uid } = useAuthStore();
    const [summaries, setSummaries] = useState<UserHistoryType[]>([]);
    const [search, setSearch] = useState<string>("");
    const [lastKey, setLastKey] = useState<Timestamp | undefined>(undefined);

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
        const summaryId = e.currentTarget.getAttribute('data-summary-id');

        if (!uid || !summaryId) {
            throw new Error("User ID or summary ID is missing");
        }

        try {
            // Get a reference to the specific document in the summaries subcollection
            const summaryDocRef = doc(db, "users", uid, "summaries", summaryId);

            // Delete the document
            await deleteDoc(summaryDocRef);

            // Update the state to remove the deleted summary
            setSummaries((prev) => prev.filter((summary) => summary.id !== summaryId));
            toast.success("Document deleted successfully");
            return true;
        } catch (error) {
            toast.error("An error occurred while deleting the summary");
            console.error("Error deleting document:", error);
            return false;
        }
    }

    // Memoize fetchHistory using useCallback
    const fetchHistory = useCallback(
        async (startAfterKey?: Timestamp) => {
            if (uid) {
                const id = toast.loading("Loading history...");
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
                const newSummaries = querySnapshot.docs.map((doc) => {
                    const d = doc.data();
                    return {
                        id: doc.id,
                        prompt: d.prompt,
                        response: d.response,
                        timestamp: d.timestamp,
                        topic: d.topic,
                        title: d.title,
                        grade: d.grade
                    };
                });

                setSummaries((prev) => [...prev, ...newSummaries]);
                setLastKey(
                    querySnapshot.docs[querySnapshot.docs.length - 1]?.data().timestamp
                );
                toast.success("History loaded successfully", { id });
            }
        },
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
        <div className="flex flex-col space-y-5">
            <h1 className="text-center text-4xl">History</h1>

            <input
                className="px-3 py-2 border rounded-md outline-none"
                type="text"
                placeholder="Filter results..."
                onChange={(e) => handleSearchChange(e.target.value)}
            />
            <div className="flex flex-col space-y-5">
                {orderedSummaries
                    .filter((summary) =>
                        (summary.response + " " + summary.prompt)
                            .toUpperCase()
                            .includes(search ? search.toUpperCase() : "")
                    )
                    .map((summary, index) => (

                        <div key={`${summary.id}-${summary.timestamp.seconds}-${index}`} className="flex flex-row gap-4 p-3 rounded-md shadow-md cursor-pointer hover:bg-gray-100 justify-between">
                            <Link
                                
                                href={`/history/${summary.id}`}
                            >
                                <div className="flex flex-row flex-wrap gap-4">
                                    <div>
                                        <strong>Grade:</strong> {summary.grade}
                                    </div>
                                    <div>
                                        <strong>Title:</strong> {summary.title}
                                    </div>
                                    <div><strong>Excerpt:</strong> {getExcerpt(summary.topic)}</div>
                                    <div>{new Date(summary.timestamp.seconds * 1000).toLocaleString()}</div>
                                </div>
                            </Link>
                            <FileX size={24} onClick={handleDelete} data-summary-id={summary.id} />

                        </div>

                    ))}
            </div>
            {
                lastKey && (
                    <button
                        className="mt-5 px-4 py-2 bg-blue-500 text-white rounded-md"
                        onClick={postsNextBatch}
                    >
                        Load More
                    </button>
                )
            }
        </div >
    );
}
