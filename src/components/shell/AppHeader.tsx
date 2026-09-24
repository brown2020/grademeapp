"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useAuthDialogStore } from "@/zustand/useAuthDialogStore";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";
import { APP_NAV, isActivePath } from "./nav";

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const uid = useAuthStore((s) => s.uid);
  const openAuth = useAuthDialogStore((s) => s.setOpen);
  // Nested routes (e.g. /assignments/abc) get a back button on mobile, where
  // the React Native wrapper has no browser chrome.
  const isNested = (pathname?.split("/").filter(Boolean).length ?? 0) > 1;

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-border bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-(--header-height) max-w-7xl items-center gap-2 px-4 sm:px-6">
        {isNested && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="-ml-2 md:hidden"
            aria-label="Go back"
            onClick={() => router.back()}
          >
            <ChevronLeft className="size-5" />
          </Button>
        )}
        <Logo className="mr-4" href={uid ? "/grader" : "/"} />

        {uid && (
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {APP_NAV.map(({ href, label, icon: Icon }) => {
              const active = isActivePath(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          {uid ? (
            <>
              <Button asChild size="sm" className="hidden md:inline-flex">
                <Link href="/grader">New grading</Link>
              </Button>
              <UserMenu />
            </>
          ) : (
            <Button size="sm" onClick={() => openAuth(true)}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
