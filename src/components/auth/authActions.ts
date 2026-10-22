import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import { isReactNativeWebView } from "@/lib/utils/platform";
import { isFirebaseError } from "./authErrors";

export type AuthMode = "signin" | "signup" | "link" | "reset";

export type AuthFields = { email: string; password: string; name: string };

/** What the dialog should do after a mode's action succeeds. */
export type AuthOutcome = "close" | "link-sent" | "reset-sent";

function rememberEmail(email: string) {
  window.localStorage.setItem("generateEmail", email);
  window.localStorage.setItem("generateName", email.split("@")[0]);
}

async function signIn({ email, password }: AuthFields): Promise<AuthOutcome> {
  await signInWithEmailAndPassword(auth, email, password);
  rememberEmail(email);
  return "close";
}

async function signUp(fields: AuthFields): Promise<AuthOutcome> {
  try {
    await createUserWithEmailAndPassword(auth, fields.email, fields.password);
    rememberEmail(fields.email);
    return "close";
  } catch (error) {
    if (isFirebaseError(error) && error.code === "auth/email-already-in-use") {
      return signIn(fields);
    }
    throw error;
  }
}

async function sendLink({ email, name }: AuthFields): Promise<AuthOutcome> {
  await sendSignInLinkToEmail(auth, email, {
    url: `${window.location.origin}/loginfinish`,
    handleCodeInApp: true,
  });
  window.localStorage.setItem("grademeEmail", email);
  window.localStorage.setItem("grademeName", name);
  return "link-sent";
}

async function sendReset({ email }: AuthFields): Promise<AuthOutcome> {
  await sendPasswordResetEmail(auth, email);
  return "reset-sent";
}

export const SUBMIT_ACTIONS: Record<AuthMode, (fields: AuthFields) => Promise<AuthOutcome>> = {
  signin: signIn,
  signup: signUp,
  link: sendLink,
  reset: sendReset,
};

export async function signInWithGoogle(): Promise<AuthOutcome> {
  // Google blocks OAuth inside embedded WebViews, so the native app never offers it.
  if (isReactNativeWebView()) {
    throw new FirebaseError("auth/operation-not-supported-in-this-environment", "Google sign-in is not available in the app.");
  }
  await signInWithPopup(auth, new GoogleAuthProvider());
  return "close";
}
