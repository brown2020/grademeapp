"use client";

import Image from "next/image";
import AuthComponent from "@/components/AuthComponent";
import logo from "@/app/assets/grade512.png";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="flex flex-col space-y-5 my-7">
      {/* Logo and Title Section */}
      <div className="flex flex-col w-full max-w-md px-10 py-5 mx-auto space-y-3 rounded-md shadow-lg bg-[#005792]">
        <Image
          className="object-cover w-full max-w-md px-10 py-5 mx-auto"
          src={logo}
          alt="logo"
          width={128}
          height={128}
          priority
        />
        <div className="text-3xl text-center text-white">GRADE.ME</div>
      </div>

      {/* Description Section */}
      <div className="flex flex-col max-w-2xl mx-auto space-y-3 text-lg border rounded-md px-5 py-3 shadow-lg">
        <p>
          Welcome to Grade.me, an AI-powered essay grading platform that helps
          improve your writing skills. Submit your essay, receive an instant
          grade, and get personalized feedback to enhance your writing.
        </p>
        <p>
          Whether refining arguments or fixing grammar, Grade.me provides the
          insights you need to succeed.
        </p>
        <p>Sign up today and start achieving your academic goals!</p>

        {/* Sign In Button */}
        <div className="flex justify-center">
          <AuthComponent />
        </div>
      </div>
      <Footer />
    </div>
  );
}
