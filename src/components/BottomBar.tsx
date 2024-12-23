"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from "@/zustand/useAuthStore";
import Image from "next/image";

import school from "@/app/assets/school.svg";
import grader from "@/app/assets/grader.svg";
import rubric from "@/app/assets/rubric.svg";
import plagiarism from "@/app/assets/ai_detect.svg";

export default function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { uid } = useAuthStore();

  if (!uid) {
    return null;
  }

  return (
    <div className="flex items-center z-20 h-16 px-4 border-t border-primary-40 bg-secondary-97 justify-between md:hidden text-slate-900 absolute right-0 left-0 bottom-0">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => {
          setTimeout(() => router.back(), 100);
        }}
      >
        <ChevronLeft size={30} className="text-primary-30 back-button-mobile" />
      </div>
      <div
        className={`flex hover:animate-wiggle rubrics-link-mobile ${pathname.startsWith("/rubrics") ? "text-primary-40 opacity-100" : "text-slate-900 opacity-90"
          }`}
        onClick={() => {
          setTimeout(() => router.push("/rubrics"), 100);
        }}
      >
        <div className="h-10 aspect-square">
          <Image alt="rubrics" src={rubric} width={75} height={75} loading="lazy" />
        </div>
      </div>
      <div
        className={`flex hover:animate-wiggle grader-link-mobile ${pathname.startsWith("/grader") ? "text-primary-40 opacity-100" : "text-slate-900 opacity-90"
          }`}
        onClick={() => {
          setTimeout(() => router.push("/grader"), 100);
        }}
      >
        <div className="h-10 aspect-square">
          <Image alt="grader" src={grader} width={75} height={75} loading="lazy" />
        </div>
      </div>
      <div
        className={`flex hover:animate-wiggle assignments-link-mobile ${pathname.startsWith("/assignments") ? "text-primary-40 opacity-100" : "text-slate-900 opacity-90"
          }`}
        onClick={() => {
          setTimeout(() => router.push("/assignments"), 100);
        }}
      >
        <div className="h-10 aspect-square">
          <Image alt="assignments" src={school} width={75} height={75} loading="lazy" />
        </div>
      </div>
      <div
        className={`flex hover:animate-wiggle assignments-link-mobile ${pathname.startsWith("/plagiarism-check") ? "text-primary-40 opacity-100" : "text-slate-900 opacity-90"
          }`}
        onClick={() => {
          setTimeout(() => router.push("/plagiarism-check"), 100);
        }}
      >
        <div className="h-10 aspect-square">
          <Image alt="plagiarism" src={plagiarism} width={75} height={75} loading="lazy" />
        </div>
      </div>
      <div
        className="flex items-center cursor-pointer forward-button-mobile"
        onClick={() => {
          setTimeout(() => router.forward(), 100);
        }}
      >
        <ChevronRight size={30} className="text-primary-30" />
      </div>
    </div>
  );
}