"use client";

import AuthCredentialsForm from "./AuthCredentialsForm";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, LockIcon, MailIcon, XIcon } from "lucide-react";
import { PulseLoader } from "react-spinners";
import type { FormEvent, RefObject } from "react";
import google_ctn from "@/app/assets/google_ctn.svg";

export type AuthShellProps = {
  uid: string | null | undefined;
  authDisplayName: string | null | undefined;
  authEmail: string | null | undefined;
  authPending: boolean;
  isVisible: boolean;
  showModal: () => void;
  hideModal: () => void;
  modalRef: RefObject<HTMLDivElement | null>;
  formRef: RefObject<HTMLFormElement | null>;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  acceptTerms: boolean;
  setAcceptTerms: (v: boolean) => void;
  isEmailLinkLogin: boolean;
  setIsEmailLinkLogin: (v: boolean) => void;
  showGoogleLogin: boolean;
  forgotPasswordMode: boolean;
  setForgotPasswordMode: (v: boolean) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean | ((p: boolean) => boolean)) => void;
  authMode: "signin" | "signup";
  setAuthMode: (v: "signin" | "signup" | ((m: "signin" | "signup") => "signin" | "signup")) => void;
  authLoading: boolean;
  signInWithGoogle: () => void;
  handleSignOut: () => void;
  handleForgotPassword: () => void | Promise<void>;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  handlePasswordSignup: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export default function AuthShell(p: AuthShellProps) {
  const {
    uid, authDisplayName, authEmail, authPending, isVisible, showModal, hideModal,
    modalRef, formRef, email, setEmail, password, setPassword, name, setName,
    acceptTerms, setAcceptTerms, isEmailLinkLogin, setIsEmailLinkLogin, showGoogleLogin,
    forgotPasswordMode, setForgotPasswordMode, showPassword, setShowPassword, authMode,
    setAuthMode, authLoading, signInWithGoogle, handleSignOut, handleForgotPassword,
    handleSubmit, handlePasswordSignup,
  } = p;

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
              type="button"
              aria-label="Close"
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
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input aria-label="Input field"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
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
              <AuthCredentialsForm
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
                  handleForgotPassword={handleForgotPassword}
                  handleSubmit={handleSubmit}
                  handlePasswordSignup={handlePasswordSignup}
                />
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
