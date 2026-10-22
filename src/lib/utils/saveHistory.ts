import { loadFirestore } from "@/firebase/loadFirestore";
import { GradingData } from "@/lib/types/grading-data";
import { Submission } from "@/lib/types/user-history";

export async function saveDocument(
  uid: string | null,
  userInput: GradingData,
  submissions: Submission[],
  fileUrl: string | null
): Promise<void> {
  if (!uid) return;

  const { db, collection, doc, setDoc, Timestamp } = await loadFirestore();
  const docRef = doc(collection(db, "users", uid, "summaries"));
  await setDoc(docRef, {
    id: docRef.id,
    userInput,
    submissions,
    fileUrl,
    timestamp: Timestamp.now(),
  });
}

export async function updateDocument(
  uid: string | null,
  summaryID: string,
  userInput: GradingData,
  submissions: Submission[],
  fileUrl: string | null
): Promise<void> {
  if (!uid) return;

  const { db, doc, updateDoc, Timestamp } = await loadFirestore();
  const docRef = doc(db, "users", uid, "summaries", summaryID);
  await updateDoc(docRef, {
    id: docRef.id,
    userInput,
    submissions,
    fileUrl,
    timestamp: Timestamp.now(),
  });
}
