"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { navItems, MENU_ITEMS } from "@/constants/menuItems";
import Image from "next/image";
import { User2, Menu, XIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import useProfileStore from "@/zustand/useProfileStore";
import { useAuthStore } from "@/zustand/useAuthStore";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";


export default function Header() {
  const profile = useProfileStore((state) => state.profile);
  const clearAuthDetails = useAuthStore((s) => s.clearAuthDetails);
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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      clearAuthDetails();
    } catch (error) {
      console.error("Error signing out:", error);
      alert("An error occurred while signing out.");
    } finally {
      closeMenu();
    }
  };

  return (
    <>
      {/* Header content */}
      <div className="z-10 flex py-1 justify-between items-center h-16 md:h-24  px-2  text-primary-20 border-b border-primary-40">


        <div className="flex h-full gap-4 items-center w-full">
          {navItems.map((item, index) => (
            item.label !== "Grade.me" ? (
              null
            ) : (
              <div
                key={index}
                className={`flex gap-x-3  md:flex-col items-center md:justify-end px-2 h-full transition duration-300 cursor-pointer hover:text-primary-40 hover:opacity-100 
                                ${pathname.slice(0, 5) === item.path.slice(0, 5) && pathname !== "/" ? "text-primary-40 opacity-100" : "text-slate-900 opacity-90"
                  }`}
                onClick={() => {
                  setTimeout(() => router.push(item.path), 100);
                }}
              >
                <div className="flex size-12 aspect-square">
                  <Image alt={item.label} src={item.image} width={50} height={50} layout="contain" objectFit="cover" className="" />
                </div>
                <div className="flex text-lg font-medium">{item.label}</div>
              </div>
            )
          ))}
        </div>


        <div className="flex gap-x-4">
          <div className="hidden md:flex h-full gap-x-4 items-center w-full">
            {navItems.map((item, index) => (
              item.label !== "Grade.me" ? (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-end px-2 h-full transition duration-300 cursor-pointer hover:text-primary-40 hover:opacity-100
                                  ${pathname.slice(0, 5) === item.path.slice(0, 5) && pathname !== "/" ? "text-primary-40 opacity-100" : "text-slate-900 opacity-90"
                    }`}
                  onClick={() => {
                    setTimeout(() => router.push(item.path), 100);
                  }}
                >
                  <div className="h-12 aspect-square">
                    <Image alt={item.label} src={item.image} width={75} height={75} layout="contain" objectFit="cover" className="" />
                  </div>
                  <div className="text-lg font-medium">{item.label}</div>
                </div>
              ) : (
                null
              )
            ))}
          </div>
          <div
            className="hidden md:flex justify-start items-center md:flex-col gap-x-2 md:gap-y-1"
            onClick={() => {
              setTimeout(() => router.push('/profile'), 100);
            }}
          >
            {uid && profile?.photoUrl ? (
              <div className="size-9 md:size-12 aspect-square">
                <Image
                  src={profile.photoUrl}
                  alt="User Avatar"
                  width={50}
                  height={50}
                  className="rounded-full border-2 border-spacing-2 border-primary-40"
                />
              </div>
            ) : uid ? (
              <div className="h-9 aspect-square">
                <User2 size={25} className="h-full w-full object-cover text-primary-30" />
              </div>
            ) : null}
            <div className="flex text-center font-medium whitespace-nowrap text-primary-10">
              {uid && profile?.displayName ? profile.displayName.split(" ")[0] : uid ? "grade.me" : ""}
            </div>
          </div>
        </div>

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
        </div>


        <div className="flex md:hidden items-end">
          <Menu size={25} className="text-primary-30 cursor-pointer" onClick={isOpen ? closeMenu : () => setIsOpen(true)} />
        </div>
      </div>


      <div className={`bg-black/30 absolute inset-0 w-full h-full z-10 ${isOpen ? 'overlay-open' : 'overlay-closed'}`} aria-hidden="true" />
      <div
        ref={menuRef}
        className={`fixed right-0 top-16 h-auto max-w-56 w-full z-10 transition-all ${isOpen ? 'animate-enter' : isExiting ? 'animate-exit' : 'hidden'}`}
      >
        <div className="bg-white rounded-bl shadow-lg px-4 py-3">
          <XIcon size={24} className="text-primary-10 cursor-pointer absolute top-2 right-2" onClick={closeMenu} />
          <ul className="mt-4">
            <li
              className="flex justify-start items-end md:flex-col md:items-end gap-x-2 md:gap-y-1 border-b border-primary-40 pb-2"
              onClick={() => {
                setTimeout(() => router.push('/profile'), 100);
              }}
            >
              {uid && profile?.photoUrl ? (
                <div className="size-9 md:size-12 aspect-square">
                  <Image
                    src={profile.photoUrl}
                    alt="User Avatar"
                    width={50}
                    height={50}
                    className="rounded-full border-2 border-spacing-2 border-primary-40"
                  />
                </div>
              ) : uid ? (
                <div className="h-9 aspect-square">
                  <User2 size={25} className="h-full w-full object-cover text-primary-30" />
                </div>
              ) : null}
              <div className="flex text-center font-medium whitespace-nowrap text-primary-10">
                {uid && profile?.identity && profile.identityLevel ? profile?.identityLevel + " " + profile?.identity : uid ? "grade.me" : ""}
              </div>
            </li>
            {MENU_ITEMS.map((item, index) => (
              <li
                key={index}
                className="cursor-pointer text-primary-30 hover:bg-gray-100 flex flex-row items-center gap-4 border-b border-primary-40 pb-2"
                onClick={() => {
                  closeMenu();
                  setTimeout(() => router.push(item.href), 100);
                }}
              >
                {item.icon && <item.icon />}{item.label}
              </li>
            ))}
            <li>
              <button onClick={handleSignOut} className="btn-shiny btn-shiny-red">
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
