import { Bot, Handshake, GlobeLock, LifeBuoy } from "lucide-react";
import school from "@/app/assets/school.svg";
import grader from "@/app/assets/grader.svg";
import rubric from "@/app/assets/rubric.svg";
import grademe from "@/app/assets/grademe.svg";
import plagiarism from "@/app/assets/ai_detect.svg";

type MenuItem = {
  label: string;
  href: string;
  show: string;
  icon: React.ComponentType;
  header: boolean;
  footer: boolean;
  desktop: string;
  mobile: string;
};

export const MENU_ITEMS: MenuItem[] = [
  {
    label: "About",
    href: "/",
    show: "everyone",
    icon: Bot,
    header: false,
    footer: true,
    desktop: 'desktop-about',
    mobile: 'mobile-menu-about',
  },
  {
    label: "Support",
    href: "/support",
    show: "everyone",
    icon: LifeBuoy,
    header: false,
    footer: true,
    desktop: 'desktop-support',
    mobile: 'mobile-menu-support',
  },
  {
    label: "Terms",
    href: "/terms",
    show: "everyone",
    icon: Handshake,
    header: false,
    footer: true,
    desktop: 'desktop-terms',
    mobile: 'mobile-menu-terms',
  },
  {
    label: "Privacy",
    href: "/privacy",
    show: "everyone",
    icon: GlobeLock,
    header: false,
    footer: true,
    desktop: 'desktop-privacy',
    mobile: 'mobile-menu-privacy',
  },
];

type navItemType = {
  label: string;
  image: string;
  path: string;
  desktop: string;
  mobile: string;
};

export const navItems: navItemType[] = [
  {
    label: `Grade.me`,
    image: grademe,
    path: "/",
    desktop: "grademe-link-desktop",
    mobile: "grademe-link-mobile",
  },
  {
    label: "rubrics",
    image: rubric,
    path: "/rubrics",
    desktop: "rubrics-link-desktop",
    mobile: "rubrics-link-mobile",
  },

  {
    label: "grader",
    image: grader,
    path: "/grader",
    desktop: "grader-link-desktop",
    mobile: "grader-link-mobile",
  },
  {
    label: "assignments",
    image: school,
    path: "/assignments",
    desktop: "assignments-link-desktop",
    mobile: "assignments-link-mobile",
  },
  {
    label: "plagiarism",
    image: plagiarism,
    path: "/plagiarism-check",
    desktop: "plagiarism-link-desktop",
    mobile: "plagiarism-link-mobile",
  }
];
