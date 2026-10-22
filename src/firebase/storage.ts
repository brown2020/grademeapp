import { getStorage, type FirebaseStorage } from "firebase/storage";
import { app } from "./firebaseClient";

export const storage = (app ? getStorage(app) : null) as FirebaseStorage;
