import { getFirestore, type Firestore } from "firebase/firestore";
import { app } from "./firebaseClient";

export const db = (app ? getFirestore(app) : null) as Firestore;
