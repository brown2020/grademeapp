import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import {
  getAuth,
  type Auth,
  type Unsubscribe,
  type User,
} from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
};

const hasClientConfig = Boolean(firebaseConfig.apiKey?.trim());

/** Minimal Auth stand-in so SSG/CI without secrets does not crash on .currentUser. */
function createDeferredAuth(): Auth {
  const authStub = {
    get currentUser(): User | null {
      return null;
    },
    onAuthStateChanged(
      nextOrObserver: ((user: User | null) => void) | { next?: (user: User | null) => void },
      error?: (err: Error) => void,
      completed?: () => void,
    ): Unsubscribe {
      const next =
        typeof nextOrObserver === "function"
          ? nextOrObserver
          : nextOrObserver?.next;
      try {
        next?.(null);
      } catch {
        /* ignore */
      }
      void error;
      void completed;
      return () => {};
    },
  };
  return authStub as unknown as Auth;
}

let app: FirebaseApp | undefined;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (hasClientConfig) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  console.warn(
    "Firebase client config missing (NEXT_PUBLIC_FIREBASE_APIKEY); deferring init",
  );
  auth = createDeferredAuth();
  db = null as unknown as Firestore;
  storage = null as unknown as FirebaseStorage;
}

export { auth, db, storage, hasClientConfig };
