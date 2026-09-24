"use client";

import { Toaster } from "react-hot-toast";
import useAuthToken from "@/lib/hooks/useAuthToken";
import { useInitializeStores } from "@/zustand/useInitializeStores";
import ErrorBoundary from "./ErrorBoundary";
import { LogoMark } from "./shell/Logo";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const { loading } = useAuthToken(process.env.NEXT_PUBLIC_COOKIE_NAME!);
  useInitializeStores();

  return (
    <ErrorBoundary>
      {loading ? (
        <div className="app-height flex items-center justify-center" role="status">
          <LogoMark className="size-10 animate-pulse" />
          <span className="sr-only">Loading Grade.me</span>
        </div>
      ) : (
        children
      )}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          className:
            "rounded-lg! border! border-border! bg-surface! text-foreground! text-sm! shadow-raised!",
          success: { iconTheme: { primary: "var(--primary)", secondary: "var(--primary-foreground)" } },
          error: { iconTheme: { primary: "var(--destructive)", secondary: "var(--destructive-foreground)" } },
        }}
      />
    </ErrorBoundary>
  );
}
