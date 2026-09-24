import Link from "next/link";
import { FOOTER_LINKS } from "./nav";

export function SiteFooter() {
  return (
    <footer className="mt-auto hidden border-t border-border md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} Grade.me</span>
        <nav aria-label="Footer" className="flex gap-5">
          {FOOTER_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
