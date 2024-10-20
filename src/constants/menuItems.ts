import { CircleUserIcon, CogIcon, FileTextIcon, ClipboardList  } from "lucide-react";

export const MENU_ITEMS: MenuItem[] = [
  {
    label: "Support",
    href: "/support",
    show: "everyone",
    header: false,
    footer: true,
  },

  {
    label: "Terms",
    href: "/terms",
    show: "everyone",
    header: false,
    footer: true,
  },
  {
    label: "Privacy",
    href: "/privacy",
    show: "everyone",
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
    label: "Tools",
    icon: CogIcon,
    path: "/tools",
  },
  {
    label: "Rubrics",
    icon: ClipboardList,
    path: "/rubrics",
  },
  {
    label: "History",
    icon: FileTextIcon,
    path: "/history",
  },

  {
    label: "Profile",
    icon: CircleUserIcon,
    path: "/profile",
  },
];
