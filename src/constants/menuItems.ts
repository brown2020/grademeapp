import { Bot, Handshake, GlobeLock, LifeBuoy } from "lucide-react";
import school from "@/app/assets/school.svg";
import dashboard from "@/app/assets/dashboard.svg";
import rubric from "@/app/assets/rubric.svg";
import grademe from "@/app/assets/grademe.svg";
import profile from "@/app/assets/profile.svg";

export const MENU_ITEMS: MenuItem[] = [
    {
        label: "About",
        href: "/",
        show: "everyone",
        icon: Bot,
        header: false,
        footer: true,
    },
    {
        label: "Support",
        href: "/support",
        show: "everyone",
        icon: LifeBuoy,
        header: false,
        footer: true,
    },
    {
        label: "Terms",
        href: "/terms",
        show: "everyone",
        icon: Handshake,
        header: false,
        footer: true,
    },
    {
        label: "Privacy",
        href: "/privacy",
        show: "everyone",
        icon: GlobeLock,
        header: false,
        footer: true,
    },
];

type navItemType = {
    label: string;
    image: string;
    path: string;
};

export const navItems: navItemType[] = [
    {
        label: "assignments",
        image: school,
        path: "/history",
    },
   
    {
        label: "rubrics",
        image: rubric,
        path: "/rubrics",
    },
    {
        label: "grademe",
        image: grademe,
        path: "/grademe",
    },
    {
        label: "dashboard",
        image: dashboard,
        path: "/dashboard",
    },

    {
        label: "profile",
        image: profile,
        path: "/profile",
    },
];
