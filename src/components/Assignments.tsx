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
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import { PlusCircle, Search, XCircle } from "lucide-react";
import { UserHistoryType } from "@/types/user-history";
import { useRouter } from "next/navigation";
import CustomButton from "./ui/CustomButton";
import AssignmentsTour from "@/components/tours/AssignmentsTour";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

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

export default function Assignments() {
  const { uid } = useAuthStore();
  const [summaries, setSummaries] = useState<UserHistoryType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [lastKey, setLastKey] = useState<Timestamp | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<{ id: string; title: string } | null>(null);
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

  const handleDeleteClick = (summaryId: string, title: string) => {
    setAssignmentToDelete({ id: summaryId, title });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!uid || !assignmentToDelete) {
      throw new Error("User ID or assignment to delete is missing");
    }

    try {
      const summaryDocRef = doc(db, "users", uid, "summaries", assignmentToDelete.id);
      await deleteDoc(summaryDocRef);
      setSummaries((prev) => prev.filter((summary) => summary.id !== assignmentToDelete.id));
      toast.success("Assignment deleted successfully");
    } catch (error) {
      toast.error("An error occurred while deleting the assignment");
      console.error("Error deleting document:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setAssignmentToDelete(null);
    }
  };

  // Memoize fetchHistory using useCallback
  const fetchHistory = useCallback(
    async (startAfterKey?: Timestamp) => {
      if (uid && !loading) {
        setLoading(true);
        const id = toast.loading("Loading history...");
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
          toast.success("Assignments loaded successfully", { id, position: "top-center" });
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
    <div className="flex flex-col gap-y-4">
      <div>
        <div className="flex gap-x-1 items-center">
          <AssignmentsTour />
          <h1>Assignments</h1>
        </div>
        <hr />
      </div>

      <CustomButton onClick={() => setTimeout(() => router.push('/grader'), 300)} className="btn-shiny btn-shiny-green w-full md:w-fit assignments-new">
        <PlusCircle />
        <p>Grade New Assignment</p>
      </CustomButton>

      <div className="flex flex-row items-center px-3 bg-secondary-95 focus-within:ring-1 ring-primary-30 rounded-full w-full ring-offset-4 shadow-sm assignments-search">
        <Search size={20} className="flex text-primary-40" />
        <input
          className="w-full px-3 h-8 outline-none bg-secondary-95 placeholder:text-primary-30"
          type="text"
          placeholder="Find an assignment..."
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      <div>
        <h2 className="text-primary-30 text-left font-medium text-lg">Recent Assignments</h2>
        <hr />
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
              className="flex flex-col px-2 py-1 rounded-lg shadow-md bg-secondary-98 assignments-card"
            >
              <div className="flex flex-col justify-between items-baseline w-full">
                <div className="flex flex-row text-primary-10 w-full font-medium cursor-pointer">
                  <p
                    className="truncate underline"
                    onClick={() => { router.push(`/assignments/${summary.id}`) }}
                  >
                    {summary.userInput?.title ?? "No title available"}
                  </p>
                  <XCircle
                    size={20}
                    className="flex ml-auto text-red-600 cursor-pointer assignments-delete"
                    onClick={() => handleDeleteClick(summary.id, summary.userInput?.title ?? "Untitled Assignment")}
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
                <hr />
                <div className="flex flex-col gap-y-2">
                  {summary.submissions.map((submission, i) => (
                    <div key={i} className="text-sm flex flex-row gap-x-2 justify-between">
                      <p>#{i + 1} </p>
                      <p>Grade: {submission.grade}</p>
                      <p>{submission.timestamp.toDate().toLocaleDateString('en-US')}</p>
                      <p
                        className="cursor-pointer underline font-medium assignments-feedback"
                        onClick={() => { router.push(`/assignments/${summary.id}/${submission.timestamp.toMillis()}`) }}
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
          className="btn btn-shiny btn-shiny-blue w-full md:fit assignments-load-more"
          onClick={postsNextBatch}
        >
          Load More
        </button>
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Assignment Deletion"
        description="Are you sure you want to delete this assignment? This action cannot be undone."
        confirmText="Delete assignment"
        itemName={assignmentToDelete?.title}
      />
    </div>
  );
}
