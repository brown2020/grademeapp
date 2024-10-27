"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { navItems, MENU_ITEMS } from "@/constants/menuItems";
import Image from "next/image";
import { User2, Menu, XIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import useProfileStore from "@/zustand/useProfileStore";
import { useAuthStore } from "@/zustand/useAuthStore";


export default function Header() {
    const profile = useProfileStore((state) => state.profile);
    const { uid } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false); // State for dialog open/close
    const [isExiting, setIsExiting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Close the dialog when clicking outside of it
        function handleClickOutside(event: TouchEvent | MouseEvent) {
            if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeMenu();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [menuRef, isOpen]);

    const closeMenu = () => {
        setIsOpen(false);
        setIsExiting(true);
        setTimeout(() => {
            setIsExiting(false);
        }, 300); // Match the duration of your exit animation
    };

    return (
        <>
            {/* Header content */}
            <div className="z-10 flex items-end pb-1 justify-between h-16 px-2 bg-primary">
                <div
                    className="flex items-end cursor-pointer gap-2"
                    onClick={() => {
                        if (window.ReactNativeWebView) {
                            window.ReactNativeWebView.postMessage("refresh");
                        } else {
                            console.log("Not React Native WebView environment");
                        }
                        setTimeout(() => router.push("/"), 100);
                    }}
                >
                    {uid && profile?.photoUrl ? (
                        <div className="h-9 aspect-square">
                            <Image
                                src={profile.photoUrl}
                                alt="User Avatar"
                                width={30}
                                height={30}
                                className="rounded-full"
                            />
                        </div>
                    ) : uid ? (
                        <div className="h-8 aspect-square">
                            <User2 size={25} className="h-full w-full object-cover text-secondary" />
                        </div>
                    ) : null}
                    <div className="text-lg whitespace-nowrap text-secondary">
                        {uid && profile?.identity && profile.identityLevel ?  profile?.identityLevel + " " + profile?.identity : uid ? "grade.me" : ""}
                    </div>
                </div>
                <div className="hidden md:flex h-full gap-2 items-center">
                    {navItems.map((item, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-1 px-2 h-full transition duration-300 cursor-pointer hover:text-accent hover:opacity-100 
                                ${pathname.slice(0, 5) === item.path.slice(0, 5) && pathname !== "/" ? "text-secondary opacity-100" : "text-secondary opacity-60"
                                }`}
                            onClick={() => {
                                setTimeout(() => router.push(item.path), 100);
                            }}
                        >
                            <div className="h-9 aspect-square">
                                <item.icon size={30} className="h-full w-full object-cover" />
                            </div>
                            <div className="text-lx font-bold">{item.label}</div>
                        </div>
                    ))}
                </div>
                <div className="flex md:hidden items-center">
                    <Menu size={25} className="text-secondary cursor-pointer" onClick={isOpen ? closeMenu : () => setIsOpen(true)} />
                </div>
            </div>


            <div className={`bg-black/30 absolute inset-0 w-full h-full z-10 ${isOpen ? 'overlay-open' : 'overlay-closed'}`} aria-hidden="true" />
            <div
                ref={menuRef}
                className={`fixed right-0 top-16 h-auto max-w-56 w-full z-10 transition-all ${isOpen ? 'animate-enter' : isExiting ? 'animate-exit' : 'hidden'}`}
            >
                <div className="bg-white rounded-bl shadow-lg px-4 py-3">
                    <XIcon size={24} className="text-primary cursor-pointer absolute top-2 right-2" onClick={closeMenu} />
                    <ul className="mt-4">
                        {MENU_ITEMS.map((item, index) => (
                            <li
                                key={index}
                                className="cursor-pointer text-primary hover:bg-gray-100 flex flex-row items-center gap-4 border-b border-primary pb-2"
                                onClick={() => {
                                    closeMenu();
                                    setTimeout(() => router.push(item.href), 100);
                                }}
                            >
                                {item.icon && <item.icon />}{item.label}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
