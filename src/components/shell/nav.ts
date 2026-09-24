import {
  FileCheck2,
  History,
  LayoutList,
  ScanSearch,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const APP_NAV: NavItem[] = [
  { label: "Grade", href: "/grader", icon: FileCheck2 },
  { label: "Rubrics", href: "/rubrics", icon: LayoutList },
  { label: "History", href: "/assignments", icon: History },
  { label: "Plagiarism", href: "/plagiarism-check", icon: ScanSearch },
];

export const FOOTER_LINKS = [
  { label: "About", href: "/" },
  { label: "Support", href: "/support" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

export function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
