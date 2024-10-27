"use client";

import { usePathname, useRouter } from "next/navigation";
import { navItems } from "@/constants/menuItems";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/zustand/useAuthStore";


export default function BottomBar() {
    const router = useRouter();
    const pathname = usePathname();
    const { uid } = useAuthStore();

    if (!uid) {
        return null;
    }

    return (
        <div className="flex items-center z-20 h-16 justify-between md:hidden bg-primary rounded-full border-2 border-collapse border-primary relative bottom-1 mx-1">
            <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                    setTimeout(() => router.back(), 100);
                }}
            >
                <ChevronLeft size={30} className="text-secondary -mr-1" />
            </div>
            {navItems.map((item, index) => (
                item.label !== "grade.me" ? (
                    <div
                        key={index}
                        className={`flex flex-col w-[3.5rem] max-w-[3.5rem] tracking-tighter items-center px-1 py-2 flex-grow cursor-pointer rounded-lg hover:text-primary hover:opacity-100 transition-colors duration-300 
                            ${pathname.slice(0, 5) === item.path.slice(0, 5) && pathname !== "/"
                            ? "text-primary bg-secondary h-14"
                            : "text-secondary"
                            }`}
                        onClick={() => {
                            setTimeout(() => router.push(item.path), 100);
                        }}
                    >
                        <div className="h-9 aspect-square">
                            <item.icon size={30} className="h-full w-full object-cover" />
                        </div>
                        <div className="text-xs w-16 text-center"><p className="truncate">{item.label}</p></div>
                    </div>
                ) : (
                    <div
                        key={index}
                        className={`relative size-18 max-w-18 -top-2 rounded-full bg-primary shadow z-20 flex flex-col items-center px-2 py-2 flex-grow cursor-pointer hover:text-primary hover:opacity-100 transition-colors duration-300 
                            ${pathname.slice(0, 5) === item.path.slice(0, 5) && pathname !== "/"
                            ? "text-primary bg-secondary border-primary border-2 shadow-none"
                            : "text-secondary"
                            }`}
                        onClick={() => {
                            setTimeout(() => router.push(item.path), 100);
                        }}
                    >
                        <div className="h-9 aspect-square">
                            <item.icon size={30} className="h-full w-full object-cover" />
                        </div>
                        <div className="text-xs mb-1">{item.label}</div>
                    </div>
                )
            ))}
            <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                    setTimeout(() => router.forward(), 100);
                }}
            >
                <ChevronRight size={30} className="text-secondary -ml-1" />
            </div>
        </div>
    );
}
