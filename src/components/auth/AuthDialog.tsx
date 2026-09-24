"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Eye, EyeOff, MailCheck } from "lucide-react";
import { auth } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useAuthDialogStore } from "@/zustand/useAuthDialogStore";
import { isIOSReactNativeWebView } from "@/lib/utils/platform";
import { signOutUser } from "@/lib/auth/signOut";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { LogoMark } from "@/components/shell/Logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authErrorMessage, isFirebaseError } from "./authErrors";

type Mode = "signin" | "signup" | "link" | "reset";

const TITLES: Record<Mode, { title: string; description: string }> = {
  signin: { title: "Welcome back", description: "Sign in to grade and improve your writing." },
  signup: { title: "Create your account", description: "Start with free credits. No card required." },
  link: { title: "Sign in with email", description: "We'll email you a one-time sign-in link." },
  reset: { title: "Reset your password", description: "We'll email you a link to choose a new one." },
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-4" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export function AuthDialog() {
  const open = useAuthDialogStore((s) => s.open);
  const setOpen = useAuthDialogStore((s) => s.setOpen);
  const uid = useAuthStore((s) => s.uid);
  const authPending = useAuthStore((s) => s.authPending);
  const setAuthDetails = useAuthStore((s) => s.setAuthDetails);

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [busy, setBusy] = useState(false);

  const showGoogle = useSyncExternalStore(
    () => () => {},
    () => !isIOSReactNativeWebView(),
    () => false
  );

  const fail = (error: unknown) => {
    console.error(error);
    toast.error(authErrorMessage(error));
  };

  const rememberEmail = () => {
    window.localStorage.setItem("generateEmail", email);
    window.localStorage.setItem("generateName", email.split("@")[0]);
  };

  const signInWithPassword = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    rememberEmail();
    setOpen(false);
  };

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (error) {
      fail(error);
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === "signin") return run(signInWithPassword);
    if (mode === "signup")
      return run(async () => {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          rememberEmail();
          setOpen(false);
        } catch (error) {
          if (isFirebaseError(error) && error.code === "auth/email-already-in-use") {
            await signInWithPassword();
            return;
          }
          throw error;
        }
      });
    if (mode === "link")
      return run(async () => {
        await sendSignInLinkToEmail(auth, email, {
          url: `${window.location.origin}/loginfinish`,
          handleCodeInApp: true,
        });
        window.localStorage.setItem("grademeEmail", email);
        window.localStorage.setItem("grademeName", name);
        setAuthDetails({ authPending: true });
      });
    return run(async () => {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent.");
      setMode("signin");
    });
  };

  const signInWithGoogle = () =>
    run(async () => {
      await signInWithPopup(auth, new GoogleAuthProvider());
      setOpen(false);
    });

  const startOver = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error(error);
    }
    setAuthDetails({ authPending: false });
  };

  const needsPassword = mode === "signin" || mode === "signup";
  const canSubmit =
    !busy && Boolean(email) && (!needsPassword || Boolean(password)) && acceptTerms;
  const { title, description } = TITLES[mode];

  return (
    <Dialog open={open && !uid} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm gap-5 p-6 sm:p-7">
        {authPending ? (
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <MailCheck className="size-6" />
            </div>
            <DialogHeader className="items-center pr-0">
              <DialogTitle>Check your inbox</DialogTitle>
              <DialogDescription>
                We sent a sign-in link to{" "}
                <span className="font-medium text-foreground">{email || "your email"}</span>.
                Open it on this device to finish signing in. If it isn&apos;t there,
                check your spam folder.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="size-4" /> Waiting for you to click the link…
            </div>
            <Button variant="ghost" size="sm" onClick={startOver}>
              Use a different email
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="items-center pr-0 text-center">
              <LogoMark className="mb-2 size-9" />
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            {showGoogle && (mode === "signin" || mode === "signup") && (
              <>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={signInWithGoogle}
                  disabled={busy || !acceptTerms}
                >
                  <GoogleIcon /> Continue with Google
                </Button>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  or
                  <span className="h-px flex-1 bg-border" />
                </div>
              </>
            )}

            <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
              {mode === "link" && (
                <Field label="Name" htmlFor="auth-name">
                  <Input
                    id="auth-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </Field>
              )}
              <Field label="Email" htmlFor="auth-email">
                <Input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </Field>
              {needsPassword && (
                <Field
                  label={
                    <span className="flex items-center justify-between">
                      Password
                      {mode === "signin" && (
                        <button
                          type="button"
                          onClick={() => setMode("reset")}
                          className="text-xs font-normal text-muted-foreground hover:text-foreground"
                        >
                          Forgot password?
                        </button>
                      )}
                    </span>
                  }
                  htmlFor="auth-password"
                >
                  <div className="relative">
                    <Input
                      id="auth-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </Field>
              )}

              {mode !== "reset" && (
                <label className="flex items-start gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 accent-(--primary)"
                    required
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              )}

              <Button type="submit" size="lg" loading={busy} disabled={!canSubmit}>
                {mode === "signin" && "Sign in"}
                {mode === "signup" && "Create account"}
                {mode === "link" && "Email me a link"}
                {mode === "reset" && "Send reset link"}
              </Button>
            </form>

            <div className="flex flex-col items-center gap-1.5 text-sm">
              {mode === "signin" && (
                <p className="text-muted-foreground">
                  New to Grade.me?{" "}
                  <button type="button" onClick={() => setMode("signup")} className="font-medium text-primary hover:underline">
                    Create an account
                  </button>
                </p>
              )}
              {mode === "signup" && (
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setMode("signin")} className="font-medium text-primary hover:underline">
                    Sign in
                  </button>
                </p>
              )}
              {(mode === "signin" || mode === "signup") && (
                <button type="button" onClick={() => setMode("link")} className="text-muted-foreground hover:text-foreground">
                  Sign in with an email link instead
                </button>
              )}
              {(mode === "link" || mode === "reset") && (
                <button type="button" onClick={() => setMode("signin")} className="text-muted-foreground hover:text-foreground">
                  Back to password sign in
                </button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
