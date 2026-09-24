import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className={cn("size-7 shrink-0", className)}
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path
        d="M9 11.5h9M9 16h6"
        className="stroke-primary-foreground"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M14.5 21.5l3.2 3.2L24.5 17"
        className="stroke-primary-foreground"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2 rounded-md", className)}
      aria-label="Grade.me home"
    >
      <LogoMark />
      <span className="font-serif text-lg font-semibold tracking-tight">
        Grade.me
      </span>
    </Link>
  );
}
