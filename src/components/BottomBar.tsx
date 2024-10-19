"use client";

import { usePathname, useRouter } from "next/navigation";
import { navItems } from "@/constants/menuItems";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BottomBar() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="flex items-center z-20 h-16 justify-between md:hidden bg-primary rounded-full relative bottom-2 mx-1 px-1">
            <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                    setTimeout(() => router.back(), 100);
                }}
            >
                <ChevronLeft size={30} className="text-secondary" />
            </div>
            {navItems.map((item, index) => (
                item.label !== "grade.me" ? (
                    <div
                        key={index}
                        className={`flex flex-col items-center px-1 py-2 flex-grow cursor-pointer hover:text-accent hover:opacity-100 transition-colors duration-300 ${pathname.slice(0, 5) === item.path.slice(0, 5) && pathname !== "/"
                            ? "text-accent"
                            : "text-secondary"
                            }`}
                        onClick={() => {
                            setTimeout(() => router.push(item.path), 100);
                        }}
                    >
                        <div className="h-9 aspect-square">
                            <item.icon size={30} className="h-full w-full object-cover" />
                        </div>
                        <div className="text-xs">{item.label}</div>
                    </div>
                ) : (
                    <div
                        key={index}
                        className={`relative size-18 max-w-18 -top-4 rounded-full bg-primary shadow z-20 flex flex-col items-center px-2 py-2.5 flex-grow cursor-pointer hover:text-accent hover:opacity-100 transition-colors duration-300 ${pathname.slice(0, 5) === item.path.slice(0, 5) && pathname !== "/"
                            ? "text-accent"
                            : "text-secondary"
                            }`}
                        onClick={() => {
                            setTimeout(() => router.push(item.path), 100);
                        }}
                    >
                        <div className="h-9 aspect-square">
                            <item.icon size={30} className="h-full w-full object-cover" />
                        </div>
                        <div className="text-xs">{item.label}</div>
                    </div>
                )
            ))}
            <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                    setTimeout(() => router.forward(), 100);
                }}
            >
                <ChevronRight size={30} className="text-secondary" />
            </div>
        </div>
    );
}
