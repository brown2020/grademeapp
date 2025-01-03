"use client";

import { useEffect, useRef, useState } from "react";
import {
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import google_ctn from "@/app/assets/google_ctn.svg";

import Image from "next/image";
import Link from "next/link";
import { LockIcon, MailIcon, XIcon } from "lucide-react";
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
  const [showGoogleLogin, setShowGoogleLogin] = useState(true);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false); // New state
  const router = useRouter();

  const showModal = () => setTimeout(() => setIsVisible(true), 300);
  const hideModal = () => setIsVisible(false);

  useEffect(() => {
    setShowGoogleLogin(!isIOSReactNativeWebView());
  }, []);

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
      await signOut(auth);
      clearAuthDetails();
    } catch (error) {
      console.error("Error signing out:", error);
      alert("An error occurred while signing out.");
    } finally {
      hideModal();
      router.push("/");
    }
  };

  const handlePasswordLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.localStorage.setItem("generateEmail", email);
      window.localStorage.setItem("generateName", email.split("@")[0]);
    } catch (error: unknown) {
      handleAuthError(error);
    } finally {
      hideModal();
    }
  };

  const handlePasswordSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.localStorage.setItem("generateEmail", email);
      window.localStorage.setItem("generateName", email.split("@")[0]);
    } catch (error: unknown) {
      if (
        isFirebaseError(error) &&
        error.code === "auth/email-already-in-use"
      ) {
        handlePasswordLogin();
        return;
      }
      hideModal();
      handleAuthError(error);
    } finally {
      hideModal();
    }
  };

  const handleAuthError = (error: unknown) => {
    if (isFirebaseError(error)) {
      toast.error(error.message);
    }
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
    <>
      <div className="flex flex-col">
        <button onClick={showModal} className="btn-shiny btn-shiny-green text-lg">
          {uid ? "You are signed in" : "Sign In to Enable Your Account"}
        </button>
      </div>

      {isVisible && (
        <div className="fixed inset-0 px-2 bg-black/60 flex justify-center items-center">
          <div
            ref={modalRef}
            className="relative bg-white text-black p-4 rounded-lg shadow-lg w-full max-w-md mx-auto"
            style={{ zIndex: 1000 }}
          >
            <button
              onClick={hideModal}
              className="absolute top-0 right-0 p-2 hover:bg-gray-400 bg-gray-200 rounded-full m-2"
            >
              <XIcon size={24} className="text-gray-800" />
            </button>

            {uid ? (
              <div className="flex flex-col gap-2">
                <div className="text-2xl text-center">You are signed in</div>
                <div className="input-disabled">{authDisplayName}</div>
                <div className="input-disabled">{authEmail}</div>
                <button onClick={handleSignOut} className="btn-shiny btn-shiny-red">
                  Sign Out
                </button>
              </div>
            ) : authPending ? (
              <div className="flex flex-col gap-2">
                <div className="text-2xl text-center">Signing you in</div>
                <div className="flex flex-col gap-3 border rounded-md px-3 py-2">
                  <div>
                    {`Check your email at ${email} for a message from Generate.me`}
                  </div>
                  <div>{`If you don't see the message, check your spam folder. Mark it "not spam" or move it to your inbox.`}</div>
                  <div>
                    Click the sign-in link in the message to complete the
                    sign-in process.
                  </div>
                  <div>
                    Waiting for you to click the sign-in link.{" "}
                    <span>
                      {" "}
                      <PulseLoader color="#000000" size={6} />
                    </span>
                  </div>
                </div>
                <button onClick={handleSignOut} className="btn-shiny btn-shiny-red">
                  Start Over
                </button>
              </div>
            ) : forgotPasswordMode ? ( // Forgot Password form
              <div className="flex flex-col gap-2">
                <div className="text-3xl text-center pb-3">Forgot Password</div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-primary"
                />
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="btn-primary"
                  disabled={!email}
                >
                  Send Password Reset Email
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordMode(false)}
                    className="underline"
                  >
                    Go Back to Sign In
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={
                  isEmailLinkLogin ? handleSubmit : handlePasswordSignup
                }
                ref={formRef}
                className="flex flex-col gap-2"
              >
                <div className="text-3xl text-center pb-3">Sign In</div>
                {showGoogleLogin && (
                  <>
                    <button
                      type="button"
                      className="w-full overflow-hidden"
                      onClick={signInWithGoogle}
                    >
                      <Image
                        src={google_ctn.src}
                        alt="Google Logo"
                        className="object-cover w-full"
                        width={100}
                        height={20}
                      />
                    </button>
                    <div className="flex items-center justify-center w-full h-12">
                      <hr className="flex-grow h-px bg-gray-400 border-0" />
                      <span className="px-3">or</span>
                      <hr className="flex-grow h-px bg-gray-400 border-0" />
                    </div>
                  </>
                )}

                {isEmailLinkLogin && (
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="input-primary mb-2"
                  />
                )}
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-primary"
                />
                {!isEmailLinkLogin && (
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="input-primary my-2"
                  />
                )}
                <button
                  type="submit"
                  className="btn btn-shiny btn-shiny-green text-lg w-fit place-self-center"
                  disabled={!email || (!isEmailLinkLogin && !password)}
                >
                  {isEmailLinkLogin ? (
                    <div className="flex items-center gap-2 h-8">
                      <MailIcon size={20} />
                      <span>Continue with Email Link</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 h-8">
                      <LockIcon size={20} />
                      <span>Continue with Password</span>
                    </div>
                  )}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsEmailLinkLogin(!isEmailLinkLogin)}
                    className="underline"
                  >
                    {isEmailLinkLogin ? "Use Email/Password" : "Use Email Link"}
                  </button>
                </div>
                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordMode(true)}
                    className="underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <label className="flex w-fit items-center space-x-2 pl-1">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-fit"
                    required
                  />
                  <span>
                    I accept the{" "}
                    <Link href={"/terms"} className="underline">
                      terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline">
                      privacy
                    </Link>{" "}
                    policy.
                  </span>
                </label>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function isFirebaseError(
  error: unknown
): error is { code: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}
