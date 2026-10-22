import { AuthDialog } from "@/components/auth/AuthDialog";
import { AppHeader } from "./AppHeader";
import { CookieBanner } from "./CookieBanner";
import { IdentityDialog } from "./IdentityDialog";
import { MobileTabBar } from "./MobileTabBar";
import { SiteFooter } from "./SiteFooter";

/**
 * Fixed-height shell with a single scrolling <main>. The document itself never
 * scrolls, which keeps the React Native WebView wrapper from rubber-banding.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-height flex flex-col">
      <a
        href="#main"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-3 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-surface focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-foreground focus-visible:shadow-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Skip to content
      </a>
      <AppHeader />
      <main
        id="main"
        className="scrollbar-thin flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain"
      >
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </main>
      <MobileTabBar />
      <AuthDialog />
      <IdentityDialog />
      <CookieBanner />
    </div>
  );
}
