"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { doc as firestoreDoc, getDoc, Timestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore from "@/zustand/useProfileStore";
import { useRubricStore } from "@/zustand/useRubricStore";
import { useParams } from "next/navigation";
import { generateGrade } from "@/actions/generateResponse";
import { readStreamableValue } from "@ai-sdk/rsc";
import ReactMarkdown from "react-markdown";
import { correctGrammarAndSpelling } from "@/actions/correctGrammarSpelling";
import { extractGrade } from "@/lib/utils/responseParser";
import { updateDocument } from "@/lib/utils/saveHistory";
import { UserHistoryType } from "@/lib/types/user-history";
import DownloadPopover from "@/components/ui/DownloadPopover";
import { Wand2 } from "lucide-react";
import Tiptap from "@/components/tiptap/Tiptap";
import { useRouter } from "next/navigation";
import Image from "next/image";
import grademe from "@/app/assets/grademe.svg";
import grader from "@/app/assets/grader_2.svg";
import { ModelSelector } from "./ModelSelector";
import { getDefaultModelId } from '@/lib/utils'
import { models } from '@/lib/types/models';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import { PlagiarismChecker } from "@/components/plagiarism/PlagiarismChecker";

export default function DocumentShell(props: {
  active: any;
  thinking: any;
  localCount: any;
  profile: any;
  gradingData: any;
  setGradingData: any;
  summary: any;
  flagged: any;
  fileUrl: any;
  selectedModelId: any;
  setSelectedModelId: any;
  onModelChange: any;
  handleSubmit: any;
  handleFixGrammarSpelling: any;
  router: any;
  uid: any;
  loading: any;
  userDoc: any;
  grade: any;
  selectedRubric: any;
  models: any;
}) {
  const { active, thinking, localCount, profile, gradingData, setGradingData, summary, flagged, fileUrl, selectedModelId, setSelectedModelId, onModelChange, handleSubmit, handleFixGrammarSpelling, router, uid, loading, userDoc, grade, selectedRubric, models } = props;
  return (

    <div className="flex flex-col gap-y-3 mb-5">
      <div>
        <h1>{gradingData.title}</h1>
        <hr />
      </div>
      <h2 className="font-medium">( Grade: {grade} )</h2>
      <button type="button" 
        onClick={() => router.push("/rubrics")}
        className="bg-primary-90 text-sm font-semibold p-2 text-center shadow-sm rounded-lg cursor-pointer"
      >
        {selectedRubric?.name ? selectedRubric.name : "Select a rubric"}
      </button>
      <div className="">
        <form className="flex flex-col gap-y-2" onSubmit={handleSubmit}>
          {/* Title */}
          <section>
            <label className="block text-primary-20 font-medium" htmlFor="title">Title</label>
            <hr />
            <input aria-label="Input field"
              type="text"
              name="title"
              id="title"
              value={gradingData.title}
              onChange={(e) => setGradingData({ title: e.target.value })}
              placeholder="Enter the title here"
              className="py-1 px-2 w-full bg-primary-90 border-b-2 border-slate-800 focus:outline-none focus:border-primary-40 focus:bg-primary-80 rounded-t-lg"
            />
          </section>
          {/* Text Editor and File Upload */}
          <section>
            <div className="relative">
              <ModelSelector
                selectedModelId={selectedModelId}
                onModelChange={id => {
                  setSelectedModelId(id)
                  onModelChange?.(id)
                }}
              />
              <label className="block font-medium text-primary-20 mt-2" htmlFor="text">Text</label>
              <hr />
              <Tiptap
                wordLimit={gradingData.wordLimit}
                wordLimitType={gradingData.wordLimitType}
                editorContent={gradingData.text}
                onChange={(text) => setGradingData({ text })}
              />
            </div>
          </section>


          <div className="flex flex-row gap-x-8 items-center justify-center md:justify-start mb-6">
            {/* Submit Button */}
            <button
              type="submit"
              id="grademe"
              onClick={handleSubmit}
              disabled={!active}
              className={`${!active ? "cursor-not-allowed" : ""}`}
            >
              <Image alt={"grader icon"} src={grader} width={50} height={50} className={`btn btn-shiny bg-secondary-97 border-2 border-primary-40 rounded-full size-12 sm:size-16 p-0 ${!active ? "cursor-not-allowed opacity-50" : ""}`} />
            </button>
            <DownloadPopover content={gradingData.text} />
            <button type="button" 
              className="btn btn-shiny btn-shiny-purple-blue rounded-full size-12 sm:size-16 flex gap-x-2 md:rounded-lg md:size-fit p-3 items-center"
              onClick={handleFixGrammarSpelling}
            >
              <Wand2 size={30} />
              <p className="hidden sm:flex">Fix Grammar & Spelling</p>
            </button>
            <PlagiarismChecker text={gradingData.text} />
          </div>


          {!thinking && profile.credits < 10 && (
            <h3>{`You don't have enough credits to grade.`}</h3>
          )}

          {thinking && !summary && !flagged && (
            <div id="thinking" className="p-5 mt-5">
              <Image alt={"grademe logo"} src={grademe} width={100} height={100} className=" animate-bounce duration-1000 place-self-center" />
            </div>
          )}

          {flagged && <h3 id="flagged">{flagged}</h3>}

          {!flagged && summary && (
            <div id="response" className="px-5 py-2 shadow-lg bg-secondary-97 border-secondary-30 border-2 rounded-md">
              <div className="flex gap-x-2 items-center justify-center">
                <Image alt={"grademe logo"} src={grademe} width={40} height={40} className="size-14" />
                <h2 className="text-2xl text-center text-primary-10 font-medium">Grade.me Report</h2>
              </div>
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          )}
        </form>
      </div>
    </div>
  
  );
}
