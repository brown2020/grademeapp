import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { UserHistoryType } from "@/lib/types/user-history";

const PAGE_SIZE = 100;

/** Older summaries stored a single submission inline; convert them to `submissions[]`. */
async function migrateIfNeeded(
  summaryDoc: QueryDocumentSnapshot<DocumentData>,
  uid: string
): Promise<DocumentData> {
  const data = summaryDoc.data();
  if (data.submissions) return data;
  const migrated = {
    submissions: [
      {
        text: data.text ?? "",
        response: data.response ?? "",
        grade: data.grade ?? "",
        timestamp: data.timestamp ?? new Date(),
      },
    ],
    userInput: data.userInput ?? {},
    fileUrl: data.fileUrl ?? "",
    timestamp: data.timestamp ?? new Date(),
  };
  await updateDoc(doc(db, "users", uid, "summaries", summaryDoc.id), migrated);
  return { ...data, ...migrated };
}

export async function fetchHistoryPage(uid: string, after?: Timestamp) {
  const summaries = collection(db, "users", uid, "summaries");
  const q = after
    ? query(summaries, orderBy("timestamp", "desc"), startAfter(after), limit(PAGE_SIZE))
    : query(summaries, orderBy("timestamp", "desc"), limit(PAGE_SIZE));

  const snapshot = await getDocs(q);
  const rows = await Promise.all(snapshot.docs.map((d) => migrateIfNeeded(d, uid)));

  const items: UserHistoryType[] = rows.map((data, i) => {
    return {
      id: snapshot.docs[i].id,
      fileUrl: data.fileUrl,
      submissions: data.submissions ?? [],
      userInput: data.userInput,
      timestamp: data.timestamp,
    };
  });

  const lastKey: Timestamp | undefined =
    snapshot.docs.length === PAGE_SIZE
      ? snapshot.docs[snapshot.docs.length - 1]?.data().timestamp
      : undefined;

  return { items, lastKey };
}

export async function deleteSummary(uid: string, id: string) {
  await deleteDoc(doc(db, "users", uid, "summaries", id));
}

export async function fetchSummary(uid: string, id: string) {
  const snap = await getDoc(doc(db, "users", uid, "summaries", id));
  return snap.exists() ? (snap.data() as UserHistoryType) : null;
}
