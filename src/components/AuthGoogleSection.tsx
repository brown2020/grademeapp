"use client";

import Image from "next/image";
import google_ctn from "@/app/assets/google_ctn.svg";

export default function AuthGoogleSection({ onGoogle }: { onGoogle: () => void }) {
  return (
    <>
      <button type="button" className="w-full overflow-hidden" onClick={onGoogle}>
        <Image src={google_ctn.src} alt="Google Logo" className="object-cover w-full" width={100} height={20} />
      </button>
      <div className="flex items-center justify-center w-full h-12">
        <hr className="grow h-px bg-gray-400 border-0" />
        <span className="px-3">or</span>
        <hr className="grow h-px bg-gray-400 border-0" />
      </div>
    </>
  );
}
