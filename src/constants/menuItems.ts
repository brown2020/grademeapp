import { User2Icon, FileTextIcon, School, Bot, FileCheck2, Handshake, GlobeLock } from "lucide-react";

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
    icon: React.ElementType;
    path: string;
};

export const navItems: navItemType[] = [
    {
        label: "assignments",
        icon: School,
        path: "/assignments",
    },
   
    {
        label: "Rubrics",
        icon: FileCheck2,
        path: "/rubrics",
    },
    {
        label: "grade.me",
        icon: Bot,
        path: "/grademe",
    },
    {
        label: "History",
        icon: FileTextIcon,
        path: "/history",
    },

    {
        label: "Profile",
        icon: User2Icon,
        path: "/profile",
    },
];
