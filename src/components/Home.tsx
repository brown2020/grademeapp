"use client";

// import Image from "next/image";
import AuthComponent from "@/components/AuthComponent";
import { Bot } from "lucide-react";
// import logo from "@/app/assets/grade512.png";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="flex flex-col space-y-5 my-7 px-2">
      {/* Logo and Title Section */}
      <div className="flex flex-col w-58 max-w-md px-10 py-6 mx-auto space-y-1 shadow-lg bg-primary rounded-full">
        <Bot size={128} className="mx-auto text-accent" />
        <div className="text-3xl text-center text-accent">GRADE.ME</div>
      </div>

      {/* Description Section */}
      <div className="flex flex-col max-w-2xl mx-auto space-y-3 text-lg rounded-md px-5 py-3 shadow-lg">
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
