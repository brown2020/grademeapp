"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { User2, Menu, XIcon, Bot, Handshake, GlobeLock, LifeBuoy } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import useProfileStore from "@/zustand/useProfileStore";
import { useAuthStore } from "@/zustand/useAuthStore";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import CustomListbox from "@/components/ui/CustomListbox";
import { userInputs } from "@/lib/constants/userInputs";
import { useMobileMenuStore } from "@/zustand/useMobileMenuStore";

import school from "@/app/assets/school.svg";
import grader from "@/app/assets/grader.svg";
import rubric from "@/app/assets/rubric.svg";
import grademe from "@/app/assets/grademe.svg";

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
      await signOut(auth);
      clearAuthDetails();
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
          <div
            className={`flex gap-x-3 md:flex-col items-center md:justify-end px-2 h-full transition duration-300 cursor-pointer hover:text-primary-40 hover:opacity-100 grademe-link-desktop ${pathname === "/" ? "text-primary-40 opacity-100" : "text-slate-900 opacity-90"
              }`}
            onClick={() => {
              setTimeout(() => router.push("/"), 100);
            }}
          >
            <div className="flex size-12 aspect-square">
              <Image alt="Grade.me" src={grademe} width={50} height={50} className="" />
            </div>
            <div className="flex text-lg font-medium">Grade.me</div>
          </div>
        </div>

        <div className="flex gap-x-4">
          <div className="hidden md:flex h-full gap-x-4 items-center w-full">
            <div
              className={`flex flex-col items-center justify-end px-2 h-full transition duration-300 cursor-pointer hover:text-primary-40 hover:opacity-100 rubrics-link-desktop ${pathname.startsWith("/rubrics") ? "text-primary-40 opacity-100" : "text-slate-900 opacity-90"
                }`}
              onClick={() => {
                setTimeout(() => router.push("/rubrics"), 100);
              }}
            >
              <div className="h-12 aspect-square">
                <Image alt="rubrics" src={rubric} width={75} height={75} className="" />
              </div>
              <div className="text-lg font-medium">rubrics</div>
            </div>
            <div
              className={`flex flex-col items-center justify-end px-2 h-full transition duration-300 cursor-pointer hover:text-primary-40 hover:opacity-100 grader-link-desktop ${pathname.startsWith("/grader") ? "text-primary-40 opacity-100" : "text-slate-900 opacity-90"
                }`}
              onClick={() => {
                setTimeout(() => router.push("/grader"), 100);
              }}
            >
              <div className="h-12 aspect-square">
                <Image alt="grader" src={grader} width={75} height={75} className="" />
              </div>
              <div className="text-lg font-medium">grader</div>
            </div>
            <div
              className={`flex flex-col items-center justify-end px-2 h-full transition duration-300 cursor-pointer hover:text-primary-40 hover:opacity-100 assignments-link-desktop ${pathname.startsWith("/assignments") ? "text-primary-40 opacity-100" : "text-slate-900 opacity-90"
                }`}
              onClick={() => {
                setTimeout(() => router.push("/assignments"), 100);
              }}
            >
              <div className="h-12 aspect-square">
                <Image alt="assignments" src={school} width={75} height={75} className="" />
              </div>
              <div className="text-lg font-medium">assignments</div>
            </div>
          </div>
          <div
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
                />
              </div>
            ) : <div className="size-9 md:size-12 aspect-square">
              <User2 size={25} className="h-full w-full object-cover" />
            </div>}
            <div className="flex text-center text-lg font-medium whitespace-nowrap">
              profile
            </div>
          </div>
        </div>

        <div className="mobile-menu flex md:hidden items-end">
          <Menu size={25} className="text-primary-30 cursor-pointer" onClick={toggleMenu} />
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
              className="profile-link-mobile flex justify-start items-end md:flex-col md:items-end gap-x-2 md:gap-y-1 border-b border-primary-40 pb-2"
              onClick={() => {
                closeMenu();
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
                <div className="cursor-pointer text-primary-30 hover:bg-gray-100 flex flex-row items-center">
                  <User2 />
                </div>
              ) : null}
              <div className="flex text-center whitespace-nowrap text-primary-30">
                Profile
              </div>
            </li>
            <li
              className="cursor-pointer text-primary-30 hover:bg-gray-100 flex flex-row items-center gap-4 border-b border-primary-40 pb-2 mobile-menu-about"
              onClick={() => {
                closeMenu();
                setTimeout(() => router.push('/'), 100);
              }}
            >
              <Bot />About
            </li>
            <li
              className="cursor-pointer text-primary-30 hover:bg-gray-100 flex flex-row items-center gap-4 border-b border-primary-40 pb-2 mobile-menu-support"
              onClick={() => {
                closeMenu();
                setTimeout(() => router.push('/support'), 100);
              }}
            >
              <LifeBuoy />Support
            </li>
            <li
              className="cursor-pointer text-primary-30 hover:bg-gray-100 flex flex-row items-center gap-4 border-b border-primary-40 pb-2 mobile-menu-terms"
              onClick={() => {
                closeMenu();
                setTimeout(() => router.push('/terms'), 100);
              }}
            >
              <Handshake />Terms
            </li>
            <li
              className="cursor-pointer text-primary-30 hover:bg-gray-100 flex flex-row items-center gap-4 border-b border-primary-40 pb-2 mobile-menu-privacy"
              onClick={() => {
                closeMenu();
                setTimeout(() => router.push('/privacy'), 100);
              }}
            >
              <GlobeLock />Privacy
            </li>
            <li>
              <button onClick={handleSignOut} className="btn-shiny btn-shiny-red mobile-menu-logout">
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>

      {uid && identityModalOpen && (
        <>
          <div ref={modalRef} className={`bg-black/30 absolute inset-0 w-full h-full z-0 ${identityModalOpen ? 'overlay-open' : 'overlay-closed'}`} aria-hidden="true" />
          <div className={`fixed w-96 bg-secondary p-4 rounded-lg flex flex-col place-self-center top-1/3 z-10 transition-all ${identityModalOpen ? 'animate-enter' : modalClosing ? 'animate-exit' : 'hidden'}`}>
            <div className="flex justify-end">
              <XIcon size={24} className="text-primary-10 cursor-pointer" onClick={closeModal} />
            </div>
            <div className="flex flex-col gap-y-4">
              <div>
                <h2 className="text-primary-30 text-left font-medium text-lg">Select your user type and level of experience.</h2>
                <p className="text-primary-30 text-left text-sm">This information helps us tailor your experience on Grade.me.</p>
                <hr />
              </div>
              <div className="flex flex-wrap items-baseline justify-center">
                <span className="mr-2">I am a</span>
                <div className="flex flex-row gap-x-2">
                  <CustomListbox
                    value={profile?.identityLevel ?? identityLevels[0]}
                    options={
                      identityLevels.map((level) => ({
                        label: level,
                        value: level,
                      }))
                    }
                    onChange={(value) => {
                      if (profile?.identityLevel !== value) {
                        updateProfile({ identityLevel: value });
                      }
                    }}
                    buttonClassName="w-fit"
                    placeholder="Select Level"
                  />
                  <CustomListbox
                    value={profile?.identity ?? "student"}
                    options={userInputs?.identity?.options?.map((identity) => ({
                      label: identity,
                      value: identity,
                    })) ?? []}
                    onChange={(value) => {
                      if (profile?.identity !== value) {
                        const newIdentityLevels = userInputs?.identity?.identityLevels?.[value] ?? ["3rd grade"];
                        updateProfile({ identity: value, identityLevel: newIdentityLevels[0] });
                      }
                    }}
                    buttonClassName="w-fit"
                    placeholder="Select User Type"
                  />
                </div>
                <span className="w-fit ml-0.5">.</span>
              </div>
              <div onClick={closeModal} className="flex place-self-end btn btn-shiny btn-shiny-green">Finish</div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

