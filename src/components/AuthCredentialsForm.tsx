"use client";

import AuthPasswordField from "./AuthPasswordField";

import AuthGoogleSection from "./AuthGoogleSection";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, LockIcon, MailIcon } from "lucide-react";
import type { FormEvent, RefObject } from "react";
import google_ctn from "@/app/assets/google_ctn.svg";
import type { AuthShellProps } from "./AuthShell";

type Props = Pick<
  AuthShellProps,
  | "formRef"
  | "email" | "setEmail"
  | "password" | "setPassword"
  | "name" | "setName"
  | "acceptTerms" | "setAcceptTerms"
  | "isEmailLinkLogin" | "setIsEmailLinkLogin"
  | "showGoogleLogin"
  | "forgotPasswordMode" | "setForgotPasswordMode"
  | "showPassword" | "setShowPassword"
  | "authMode" | "setAuthMode"
  | "authLoading"
  | "signInWithGoogle"
  | "handleForgotPassword"
  | "handleSubmit"
  | "handlePasswordSignup"
>;

export default function AuthCredentialsForm(p: Props) {
  const {
    formRef, email, setEmail, password, setPassword, name, setName,
    acceptTerms, setAcceptTerms, isEmailLinkLogin, setIsEmailLinkLogin,
    showGoogleLogin, setForgotPasswordMode, showPassword, setShowPassword,
    authMode, setAuthMode, authLoading, signInWithGoogle, handleSubmit,
    handlePasswordSignup,
  } = p;
  return (
<form
                onSubmit={
                  isEmailLinkLogin ? handleSubmit : handlePasswordSignup
                }
                ref={formRef}
                className="flex flex-col gap-2"
              >
                <div className="text-3xl text-center pb-3">{authMode === "signin" ? "Sign In" : "Create Account"}</div>
                {showGoogleLogin && <AuthGoogleSection onGoogle={signInWithGoogle} />}

                {isEmailLinkLogin && (
                  <input aria-label="Input field"
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="input-primary mb-2"
                  />
                )}
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
                {!isEmailLinkLogin && (
                  <AuthPasswordField password={password} setPassword={setPassword} showPassword={showPassword} setShowPassword={setShowPassword} authMode={authMode} />
                )}
                <button
                  type="submit"
                  className="btn btn-shiny btn-shiny-green text-lg w-fit place-self-center"
                  disabled={authLoading || !email || (!isEmailLinkLogin && !password)}
                >
                  {isEmailLinkLogin ? (
                    <div className="flex items-center gap-2 h-8">
                      <MailIcon size={20} />
                      <span>Continue with Email Link</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 h-8">
                      <LockIcon size={20} />
                      <span>{authLoading ? "Please wait…" : authMode === "signin" ? "Sign In" : "Create Account"}</span>
                    </div>
                  )}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsEmailLinkLogin(!isEmailLinkLogin)}
                    className="underline text-slate-800"
                  >
                    {isEmailLinkLogin ? "Use Email/Password" : "Use Email Link"}
                  </button>
                </div>
                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordMode(true)}
                    className="underline text-slate-800"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="text-center mt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setAuthMode((m) => (m === "signin" ? "signup" : "signin"))
                    }
                    className="underline text-slate-800"
                  >
                    {authMode === "signin"
                      ? "Need an account? Create one"
                      : "Already have an account? Sign in"}
                  </button>
                </div>
                <label className="flex w-fit items-center space-x-2 pl-1">
                  <input aria-label="Input field"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-fit"
                    required
                  />
                  <span>
                    I accept the{" "}
                    <Link href={"/terms"} className="underline text-slate-800">
                      terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline text-slate-800">
                      privacy
                    </Link>{" "}
                    policy.
                  </span>
                </label>
              </form>
  );
}
