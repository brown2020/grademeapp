"use client";

import { usePathname, useRouter } from "next/navigation";
import { navItems } from "@/constants/menuItems";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/zustand/useAuthStore";
import Image from "next/image";




export default function BottomBar() {
    const router = useRouter();
    const pathname = usePathname();
    const { uid } = useAuthStore();

    if (!uid) {
        return null;
    }

    return (
        <div className="flex items-center z-20 h-16 border-t border-primary-40 justify-between md:hidden text-slate-900 absolute right-0 left-0 bottom-0">
            <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                    setTimeout(() => router.back(), 100);
                }}
            >
                <ChevronLeft size={30} className="text-primary-30 -mr-1" />
            </div>
            {navItems.map((item, index) => (
                item.label !== "grademe" ? (
                    <div
                        key={index}
                        className={`flex hover:animate-wiggle 
                            ${pathname.slice(0, 5) === item.path.slice(0, 5) && pathname !== "/"
                            ? ""
                            : ""
                            }`}
                        onClick={() => {
                            setTimeout(() => router.push(item.path), 100);
                        }}
                    >
                        <div className="h-10 aspect-square">
                            <Image alt={item.label} src={item.image} width={75} height={75} layout="contain" objectFit="cover" />
                        </div>
                    </div>
                ) : (
                    <div
                        key={index}
                        className={`flex hover:animate-wiggle
                            ${pathname.slice(0, 5) === item.path.slice(0, 5) && pathname !== "/grademe"
                                ? ""
                                : ""
                            }`}
                        onClick={() => {
                            setTimeout(() => router.push(item.path), 100);
                        }}
                    >
                        <div className="h-10 aspect-square -top-1.5 relative">
                            <Image alt={item.label} src={item.image} width={75} height={75} layout="contain" objectFit="cover" />
                        </div>

                    </div>
                )
            ))}
            <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                    setTimeout(() => router.forward(), 100);
                }}
            >
                <ChevronRight size={30} className="text-primary-30 -ml-1" />
            </div>
        </div>
    );
}
