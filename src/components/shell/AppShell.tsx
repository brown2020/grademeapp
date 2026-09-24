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
      <AppHeader />
      <main
        id="main"
        className="scrollbar-thin flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
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
