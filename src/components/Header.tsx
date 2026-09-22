"use client";

import HeaderMobileDrawer from "./HeaderMobileDrawer";
import HeaderIdentityModal from "./HeaderIdentityModal";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { User2, Menu, XIcon, Bot, Handshake, GlobeLock, LifeBuoy } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import useProfileStore from "@/zustand/useProfileStore";
import { useAuthStore } from "@/zustand/useAuthStore";
import { signOut } from "firebase/auth";
import { deleteCookie } from "cookies-next";
import { auth } from "@/firebase/firebaseClient";
import CustomListbox from "@/components/ui/CustomListbox";
import { userInputs } from "@/lib/constants/userInputs";
import { useMobileMenuStore } from "@/zustand/useMobileMenuStore";

import school from "@/app/assets/school.svg";
import grader from "@/app/assets/grader.svg";
import rubric from "@/app/assets/rubric.svg";
import grademe from "@/app/assets/grademe.svg";
import plagiarism from "@/app/assets/ai_detect.svg";

export default function Header() {
  const { isOpen, setIsOpen, toggleMenu } = useMobileMenuStore();
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const identityLevels = userInputs?.identity?.identityLevels?.[profile?.identity ?? "student"] ?? ["3rd grade"];
  const clearAuthDetails = useAuthStore((s) => s.clearAuthDetails);
  const { uid } = useAuthStore();
  const [isExiting, setIsExiting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [identityModalOpen, setIdentityModalOpen] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (uid && profile && profile.contactEmail && !profile.identity) {
      setIdentityModalOpen(true);
    }

    if (uid && profile && profile.contactEmail && profile.identity && !profile.identityLevel) {
      setIdentityModalOpen(true);
    }
  }, [uid, profile, profile?.identity, profile?.identityLevel]);

  const closeMenu = () => {
    setIsOpen(false);
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
    }, 300);
  };

  const closeModal = () => {
    setIdentityModalOpen(false);
    setModalClosing(true);
    setTimeout(() => {
      setModalClosing(false);
    }, 300);
  };

  const handleSignOut = async () => {
    try {
      // 1. Delete auth cookie BEFORE Firebase sign-out.
      const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || "authToken";
      deleteCookie(cookieName, { path: "/" });

      // 2. Sign out of Firebase.
      await signOut(auth);

      // 3. Clear auth store.
      clearAuthDetails();

      // 4. Clear browser storage.
      if (typeof window !== "undefined") {
        sessionStorage.clear();
      }
    } catch (error) {
      console.error("Error signing out:", error);
      alert("An error occurred while signing out.");
    } finally {
      closeMenu();
      router.push("/");
    }
  };

  return (
    <>
      <div className="z-10 flex py-1 justify-between items-center h-16 md:h-24 px-2 text-primary-20 border-b border-primary-40">
        <div className="flex h-full gap-4 items-center w-full">
          <button type="button" 
            className={`flex gap-x-3 md:flex-col items-center md:justify-end px-2 h-full transition duration-300 cursor-pointer hover:text-primary-40 hover:opacity-100 grademe-link-desktop ${pathname === "/" ? "text-primary-40 opacity-100" : "text-slate-900 opacity-90"
              }`}
            onClick={() => {
              setTimeout(() => router.push("/"), 100);
            }}
          >
            <div className="flex size-12 aspect-square">
              <Image alt="Grademe logo" src={grademe} loading="lazy" className="size-12" />
            </div>
            <div className="flex text-lg font-medium">Grade.me</div>
          </button>
        </div>

        <div className="flex gap-x-4">
          <div className="hidden md:flex h-full gap-x-4 items-center w-full">
            <button type="button" 
              className={`flex flex-col items-center justify-end px-2 h-full transition duration-300 cursor-pointer hover:text-primary-40 hover:opacity-100 rubrics-link-desktop ${pathname?.startsWith("/rubrics") ? "text-primary-40 opacity-100" : "text-slate-900 opacity-90"
                }`}
              onClick={() => {
                setTimeout(() => router.push("/rubrics"), 100);
              }}
            >
              <div className="h-12 aspect-square">
                <Image alt="rubrics" src={rubric} width={75} height={75} loading="lazy" />
              </div>
              <div className="text-lg font-medium">rubrics</div>
            </button>
            <button type="button" 
              className={`flex flex-col items-center justify-end px-2 h-full transition duration-300 cursor-pointer hover:text-primary-40 hover:opacity-100 grader-link-desktop ${pathname?.startsWith("/grader") ? "text-primary-40 opacity-100" : "text-slate-900 opacity-90"
                }`}
              onClick={() => {
                setTimeout(() => router.push("/grader"), 100);
              }}
            >
              <div className="h-12 aspect-square">
                <Image alt="grader" src={grader} width={75} height={75} loading="lazy" />
              </div>
              <div className="text-lg font-medium">grader</div>
            </button>
            <button type="button" 
              className={`flex flex-col items-center justify-end px-2 h-full transition duration-300 cursor-pointer hover:text-primary-40 hover:opacity-100 assignments-link-desktop ${pathname?.startsWith("/assignments") ? "text-primary-40 opacity-100" : "text-slate-900 opacity-90"
                }`}
              onClick={() => {
                setTimeout(() => router.push("/assignments"), 100);
              }}
            >
              <div className="h-12 aspect-square">
                <Image alt="assignments" src={school} width={75} height={75} loading="lazy" />
              </div>
              <div className="text-lg font-medium">assignments</div>
            </button>
          </div>
          <button type="button" 
            className="cursor-pointer hidden md:flex justify-start items-center md:flex-col gap-x-2 md:gap-y-0 hover:text-primary-40 text-primary-10 plagiarism-link-desktop"
            onClick={() => {
              setTimeout(() => router.push("/plagiarism-check"), 100);
            }}>
            <div className="h-12 aspect-square">
              <Image alt="plagiarism" src={plagiarism} width={75} height={75} loading="lazy" />
            </div>
            <div className="text-lg font-medium">plagiarism</div>
          </button>

          <button type="button" 
            className="cursor-pointer hidden md:flex justify-start items-center md:flex-col gap-x-2 md:gap-y-0 hover:text-primary-40 text-primary-10 profile-link-desktop"
            onClick={() => {
              setTimeout(() => router.push('/profile'), 100);
            }}
          >
            {uid && profile?.photoUrl ? (
              <div className={`size-9 md:size-12 aspect-square`}>
                <Image
                  src={profile.photoUrl}
                  alt="User Avatar"
                  width={50}
                  height={50}
                  className="rounded-full border-2 border-spacing-2 border-primary-40"
                  loading="lazy"
                />
              </div>
            ) : <div className="size-9 md:size-12 aspect-square">
              <User2 size={25} className="h-full w-full object-cover" />
            </div>}
            <div className="flex text-center text-lg font-medium whitespace-nowrap">
              profile
            </div>
          </button>
        </div>

        <div className="mobile-menu flex md:hidden items-end">
          <button type="button" aria-label="Open menu" className="bg-transparent border-0 p-0" onClick={toggleMenu}><Menu size={25} className="text-primary-30" /></button>
        </div>
      </div>

      <HeaderMobileDrawer isExiting={isExiting} closeMenu={closeMenu} handleSignOut={handleSignOut} menuRef={menuRef} />
      <HeaderIdentityModal identityModalOpen={identityModalOpen} modalClosing={modalClosing} closeModal={closeModal} modalRef={modalRef} />

    </>
  );
}

