"use client";

import AuthComponent from "@/components/AuthComponent";
import Image from "next/image";
import grademe from "@/app/assets/grademe.svg";
import Footer from "./Footer";
import { HomeTour } from "@/components/tours/HomeTour";

export default function Home() {
  return (
    <div className="flex flex-col my-7 px-2">
      {/* Logo and Title Section */}
      <div className="flex flex-col w-58 max-w-md size-56 items-center justify-center mx-auto shadow-2xl bg-secondary border-4 border-primary-40 rounded-full mb-3">
        <Image src={grademe} alt="Grademe logo" className="size-40" priority />
        <div className="text-2xl text-center text-primary-40 leading-6">Grade.me</div>
      </div>

      <HomeTour />
      {/* Description Section */}
      <div className="mt-0 pt-0 flex flex-col max-w-2xl mx-auto space-y-3 text-lg rounded-md px-5 py-4">
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
