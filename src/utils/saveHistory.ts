// src/utils/saveHistory.ts
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { GradingData } from "@/types/grading-data";
import { Submission } from "@/types/user-history";

// Define types for the saveHistory function
export async function saveHistory(
    uid: string | null,
    userInput: GradingData,
    submissions: Submission[],
    fileUrl: string | null
): Promise<void> {
    if (!uid) return;

    const docRef = doc(collection(db, "users", uid, "summaries"));
    await setDoc(docRef, {
        id: docRef.id,
        userInput,
        submissions,
        fileUrl,
        timestamp: Timestamp.now(),
    });
    console.log("Document saved successfully.");
}
