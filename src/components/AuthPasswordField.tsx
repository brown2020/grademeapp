"use client";

import { Eye, EyeOff } from "lucide-react";

type Props = {
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean | ((p: boolean) => boolean)) => void;
  authMode: "signin" | "signup";
};

export default function AuthPasswordField({
  password, setPassword, showPassword, setShowPassword, authMode,
}: Props) {
  return (
    <div className="relative my-2">
      <label htmlFor="auth-password" className="sr-only">Password</label>
      <input
        aria-label="Input field"
        id="auth-password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        autoComplete={authMode === "signin" ? "current-password" : "new-password"}
        className="input-primary w-full pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
