"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bot, GlobeLock, Handshake, LifeBuoy, User2, XIcon } from "lucide-react";
import { RefObject } from "react";
import useProfileStore from "@/zustand/useProfileStore";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useMobileMenuStore } from "@/zustand/useMobileMenuStore";

type Props = {
  isExiting: boolean;
  closeMenu: () => void;
  handleSignOut: () => void;
  menuRef: RefObject<HTMLDivElement | null>;
};

export default function HeaderMobileDrawer({ isExiting, closeMenu, handleSignOut, menuRef }: Props) {
  const router = useRouter();
  const { isOpen } = useMobileMenuStore();
  const uid = useAuthStore((s) => s.uid);
  const profile = useProfileStore((s) => s.profile);
  return (
    <>
      <div className={`bg-black/30 absolute inset-0 w-full h-full z-10 ${isOpen ? 'overlay-open' : 'overlay-closed'}`} aria-hidden="true" />
      <div
        ref={menuRef}
        className={`fixed right-0 top-16 h-auto max-w-56 w-full z-10 transition-all ${isOpen ? 'animate-enter' : isExiting ? 'animate-exit' : 'hidden'}`}
      >
        <div className="bg-white rounded-bl shadow-lg px-4 py-3">
          <button type="button" aria-label="Close menu" className="bg-transparent border-0 p-0 absolute top-2 right-2" onClick={closeMenu}><XIcon size={24} className="text-primary-10" /></button>
          <ul className="mt-4">
            <li
              className="profile-link-mobile flex justify-start items-end md:flex-col md:items-end gap-x-2 md:gap-y-1 border-b border-primary-40 pb-2"
              onClick={() => {
                closeMenu();
                setTimeout(() => router.push('/profile'), 100);
              }}
             role="menuitem" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); (e.currentTarget as HTMLElement).click(); } }}>
              {uid && profile?.photoUrl ? (
                <div className="size-9 md:size-12 aspect-square">
                  <Image
                    src={profile.photoUrl}
                    alt="User Avatar"
                    width={50}
                    height={50}
                    className="rounded-full border-2 border-spacing-2 border-primary-40"
                    loading="lazy"
                  />
                </div>
              ) : uid ? (
                <div className="cursor-pointer text-primary-20 hover:bg-gray-100 flex flex-row items-center">
                  <User2 />
                </div>
              ) : null}
              <div className="flex text-center whitespace-nowrap text-primary-20">
                Profile
              </div>
            </li>
            <li
              className="cursor-pointer text-primary-20 hover:bg-gray-100 flex flex-row items-center gap-4 border-b border-primary-40 pb-2 mobile-menu-about"
              onClick={() => {
                closeMenu();
                setTimeout(() => router.push('/'), 100);
              }}
             role="menuitem" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); (e.currentTarget as HTMLElement).click(); } }}>
              <Bot />About
            </li>
            <li
              className="cursor-pointer text-primary-20 hover:bg-gray-100 flex flex-row items-center gap-4 border-b border-primary-40 pb-2 mobile-menu-support"
              onClick={() => {
                closeMenu();
                setTimeout(() => router.push('/support'), 100);
              }}
             role="menuitem" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); (e.currentTarget as HTMLElement).click(); } }}>
              <LifeBuoy />Support
            </li>
            <li
              className="cursor-pointer text-primary-20 hover:bg-gray-100 flex flex-row items-center gap-4 border-b border-primary-40 pb-2 mobile-menu-terms"
              onClick={() => {
                closeMenu();
                setTimeout(() => router.push('/terms'), 100);
              }}
             role="menuitem" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); (e.currentTarget as HTMLElement).click(); } }}>
              <Handshake />Terms
            </li>
            <li
              className="cursor-pointer text-primary-20 hover:bg-gray-100 flex flex-row items-center gap-4 border-b border-primary-40 pb-2 mobile-menu-privacy"
              onClick={() => {
                closeMenu();
                setTimeout(() => router.push('/privacy'), 100);
              }}
             role="menuitem" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); (e.currentTarget as HTMLElement).click(); } }}>
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


    </>
  );
}
