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
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";

type UserHistoryType = {
  timestamp: Timestamp;
  prompt: string;
  response: string;
  topic: string;
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
            id: doc.id, // Ensure unique key using doc.id from Firestore
            prompt: d.prompt,
            response: d.response,
            timestamp: d.timestamp,
            topic: d.topic,
          };
        });

        setSummaries((prev) => [...prev, ...newSummaries]);
        setLastKey(
          querySnapshot.docs[querySnapshot.docs.length - 1]?.data().timestamp
        );
        toast.success("History loaded successfully", { id });
      }
    },
    [uid] // Only re-create fetchHistory if `uid` changes
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
            <div
              key={`${summary.id}-${summary.timestamp.seconds}-${index}`} // Use index to make sure keys are unique
              className="p-3 rounded-md shadow-md"
            >
              <div>
                {new Date(summary.timestamp.seconds * 1000).toLocaleString()}
              </div>

              <div className="whitespace-pre-wrap">{summary.prompt}</div>
              <div className="response">{summary.response}</div>
            </div>
          ))}
      </div>
      {lastKey && (
        <button
          className="mt-5 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={postsNextBatch}
        >
          Load More
        </button>
      )}
    </div>
  );
}
