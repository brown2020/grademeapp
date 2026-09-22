"use client";

import AuthShell from "./AuthShell";
import { isFirebaseError } from "./authErrors";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { deleteCookie } from "cookies-next";
import google_ctn from "@/app/assets/google_ctn.svg";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, LockIcon, MailIcon, XIcon } from "lucide-react";
import { PulseLoader } from "react-spinners";
import { useAuthStore } from "@/zustand/useAuthStore";
import { auth } from "@/firebase/firebaseClient";
import { isIOSReactNativeWebView } from "@/lib/utils/platform";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AuthComponent() {
  const setAuthDetails = useAuthStore((s) => s.setAuthDetails);
  const clearAuthDetails = useAuthStore((s) => s.clearAuthDetails);
  const uid = useAuthStore((s) => s.uid);
  const authEmail = useAuthStore((s) => s.authEmail);
  const authDisplayName = useAuthStore((s) => s.authDisplayName);
  const authPending = useAuthStore((s) => s.authPending);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [acceptTerms, setAcceptTerms] = useState<boolean>(true);
  const formRef = useRef<HTMLFormElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isEmailLinkLogin, setIsEmailLinkLogin] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false); // New state
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authLoading, setAuthLoading] = useState(false);
  const router = useRouter();

  const showModal = () => setTimeout(() => setIsVisible(true), 300);
  const hideModal = () => setIsVisible(false);

  const showGoogleLogin = useSyncExternalStore(
    () => () => {},
    () => !isIOSReactNativeWebView(),
    () => false
  );

  const signInWithGoogle = async () => {
    if (!acceptTerms) {
      if (formRef.current) {
        formRef.current.reportValidity();
      }
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      hideModal();
    }
  };

  const handleSignOut = async () => {
    try {
      // 1. Delete auth cookie BEFORE Firebase sign-out.
      const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || "authToken";
      deleteCookie(cookieName, { path: "/" });

      // 2. Sign out of Firebase.
      await signOut(auth);

      // 3. Clear auth store.
      clearAuthDetails();

      // 4. Clear browser storage.
      if (typeof window !== "undefined") {
        sessionStorage.clear();
      }
    } catch (error) {
      console.error("Error signing out:", error);
      alert("An error occurred while signing out.");
    } finally {
      hideModal();
      router.push("/");
    }
  };

  const handlePasswordLogin = async () => {
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.localStorage.setItem("generateEmail", email);
      window.localStorage.setItem("generateName", email.split("@")[0]);
      hideModal();
    } catch (error: unknown) {
      handleAuthError(error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePasswordSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (authMode === "signin") {
      await handlePasswordLogin();
      return;
    }
    setAuthLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.localStorage.setItem("generateEmail", email);
      window.localStorage.setItem("generateName", email.split("@")[0]);
      hideModal();
    } catch (error: unknown) {
      if (
        isFirebaseError(error) &&
        error.code === "auth/email-already-in-use"
      ) {
        setAuthLoading(false);
        await handlePasswordLogin();
        return;
      }
      handleAuthError(error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthError = (error: unknown) => {
    if (!isFirebaseError(error)) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    const messages: Record<string, string> = {
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/user-disabled": "This account has been disabled.",
      "auth/user-not-found": "No account found with that email.",
      "auth/wrong-password": "Incorrect password. Try again or reset it.",
      "auth/invalid-credential": "Email or password is incorrect.",
      "auth/too-many-requests": "Too many attempts. Please wait and try again.",
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/weak-password": "Password should be at least 6 characters.",
      "auth/network-request-failed": "Network error. Check your connection.",
      "auth/missing-email": "Please enter your email address.",
      "auth/invalid-action-code": "This reset link is invalid or expired.",
    };
    toast.error(messages[error.code] ?? "Unable to authenticate. Please try again.");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const actionCodeSettings = {
      url: `${window.location.origin}/loginfinish`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("grademeEmail", email);
      window.localStorage.setItem("grademeName", name);
      setAuthDetails({ authPending: true });
    } catch (error) {
      console.error("Error sending sign-in link:", error);
      alert("An error occurred while sending the sign-in link.");
      hideModal();
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
      setForgotPasswordMode(false);
    } catch (error: unknown) {
      handleAuthError(error);
    }
  };

  return (
    <AuthShell
      uid={uid}
      authDisplayName={authDisplayName}
      authEmail={authEmail}
      authPending={authPending}
      isVisible={isVisible}
      showModal={showModal}
      hideModal={hideModal}
      modalRef={modalRef}
      formRef={formRef}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      name={name}
      setName={setName}
      acceptTerms={acceptTerms}
      setAcceptTerms={setAcceptTerms}
      isEmailLinkLogin={isEmailLinkLogin}
      setIsEmailLinkLogin={setIsEmailLinkLogin}
      showGoogleLogin={showGoogleLogin}
      forgotPasswordMode={forgotPasswordMode}
      setForgotPasswordMode={setForgotPasswordMode}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      authMode={authMode}
      setAuthMode={setAuthMode}
      authLoading={authLoading}
      signInWithGoogle={signInWithGoogle}
      handleSignOut={handleSignOut}
      handleForgotPassword={handleForgotPassword}
      handleSubmit={handleSubmit}
      handlePasswordSignup={handlePasswordSignup}
    />
  );
}
