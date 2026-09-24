"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/zustand/useAuthStore";
import { APP_NAV, isActivePath } from "./nav";

export function MobileTabBar() {
  const pathname = usePathname();
  const uid = useAuthStore((s) => s.uid);
  if (!uid) return null;

  return (
    <nav
      aria-label="Main"
      className="pb-safe shrink-0 border-t border-border bg-background/95 backdrop-blur md:hidden"
    >
      <ul className="grid h-(--tabbar-height) grid-cols-4">
        {APP_NAV.map(({ href, label, icon: Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
