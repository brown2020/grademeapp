"use client";
import { useEffect, useState, useCallback, FormEvent } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
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

const fetchDocumentById = async (uid: string, id: string) => {
  const docRef = collection(db, "users", uid, "summaries");
  const docSnap = await getDocs(docRef);
  // Return the document with the given id
  return docSnap.docs.filter((doc) => doc.id === id).map((doc) => doc.data());
};

interface DocumentProps {
  onModelChange?: (id: string) => void
}

const Document = ({ onModelChange }: DocumentProps) => {
  const { uid } = useAuthStore();
  const { profile, minusCredits } = useProfileStore();
  const { selectedRubric, gradingData, setGradingData } = useRubricStore();
  const { summaryID, timestamp } = useParams();
  const [submissionTimestamp, setSubmissionTimestamp] = useState<Timestamp>();
  const [userDoc, setUserDoc] = useState<UserHistoryType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [grade, setGrade] = useState<string>("");
  const [thinking, setThinking] = useState<boolean>(false);
  const [localCount, setLocalCount] = useState<number>(profile.credits);
  const [isStreamingComplete, setIsStreamingComplete] = useState<boolean>(false);
  const [hasSaved, setHasSaved] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>("");
  const [flagged, setFlagged] = useState<string>("");
  const [active, setActive] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useLocalStorage<string>(
    'selectedModel',
    getDefaultModelId(models)
  )
  const router = useRouter();

  // get timestamp from path /assignments/${summary.id}/${submission.timestamp}
  useEffect(() => {
    const submissionTimestamp = Timestamp.fromMillis(Number(timestamp));
    setSubmissionTimestamp(submissionTimestamp);
  }, [timestamp]);

  // Load the requested document
  useEffect(() => {
    const getDocument = async () => {
      try {
        const doc = await fetchDocumentById(uid as string, summaryID as string);
        setUserDoc(doc[0] as UserHistoryType);
        toast.dismiss();
        toast.success("Document loaded successfully", { id: "loading" });
      } catch (error) {
        console.error("Error in getDocument", error);
        toast.error("Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    if (uid && summaryID && submissionTimestamp) {
      toast.loading("Loading document...");
      getDocument();
    }
  }, [uid, summaryID, submissionTimestamp]);

  // Find the matching submission
  useEffect(() => {
    if (userDoc && submissionTimestamp) {
      // Find the submission with the matching timestamp
      const matchingSubmission = userDoc.submissions.find((sub) =>
        sub.timestamp.seconds === submissionTimestamp.seconds &&
        sub.timestamp.nanoseconds === submissionTimestamp.nanoseconds
      );
      if (matchingSubmission) {
        setGradingData({
          title: userDoc.userInput.title,
          text: matchingSubmission.text,
          assigner: userDoc.userInput.assigner,
          textType: userDoc.userInput.textType,
          topic: userDoc.userInput.topic,
          prose: userDoc.userInput.prose,
          audience: userDoc.userInput.audience,
          wordLimitType: userDoc.userInput.wordLimitType as
            | "less than"
            | "more than"
            | "between",
          wordLimit: userDoc.userInput.wordLimit,
          customRubric: userDoc.userInput.customRubric,
          rubric: userDoc.userInput.rubric,
        });
        setSummary(matchingSubmission.response);
        setGrade(matchingSubmission.grade);
        setFileUrl(userDoc.fileUrl);
      }

    }
  }, [userDoc, submissionTimestamp, setGradingData]);

  // Effect to update the active state
  useEffect(() => {
    setActive(gradingData.text.length > 1 && localCount > 0 || !profile.useCredits && !thinking);
  }, [localCount, gradingData.text, thinking, profile.useCredits]);

  // Get the current amount of credits from the profile
  useEffect(() => {
    setLocalCount(profile.credits);
  }, [profile]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setThinking(true);
    setSummary("");
    setFlagged("");
    setIsStreamingComplete(false);
    setHasSaved(false);
    setActive(false);

    try {
      const {
        assigner,
        topic,
        prose,
        audience,
        wordLimitType,
        wordLimit,
        title,
        rubric,
        text,
      } = gradingData;

      const { result, creditsUsed } = await generateGrade(
        selectedModelId || "",
        profile.identity || "",
        profile.identityLevel || "",
        assigner,
        topic,
        prose,
        audience,
        wordLimitType,
        wordLimit,
        rubric,
        title,
        text,
        profile.credits,
        profile.useCredits,
        uid
      );

      if (!result) throw new Error("No response");

      const creditsDeducted = await minusCredits(creditsUsed);

      if (!creditsDeducted) {
        throw new Error("Failed to deduct credits.");
      }

      for await (const content of readStreamableValue(result)) {
        if (content) {
          setSummary(content.trim());
          setGrade(extractGrade(content.trim()));
        }
      }

      setThinking(false);
      setLocalCount((prev) => prev - creditsUsed);
      setIsStreamingComplete(true);
    } catch (error) {
      console.error(error);
      setThinking(false);
      setFlagged(
        "No suggestions found. Servers might be overloaded right now."
      );
    } finally {
      setThinking(false);
    }
  },
    [gradingData, minusCredits, profile.credits, profile.identity, profile.identityLevel, profile.useCredits, selectedModelId, uid]
  );

  // Effect to handle saving to history
  useEffect(() => {
    if (isStreamingComplete && !hasSaved && summary) {

      const newSubmission = {
        text: gradingData.text,
        response: summary,
        grade,
        timestamp: Timestamp.now(),
      }

      const updatedSubmissions = userDoc?.submissions
        ? [...userDoc.submissions, newSubmission]
        : [newSubmission];

      if (Array.isArray(summaryID) && typeof summaryID[0] === "string") {
        updateDocument(uid, summaryID[0], gradingData, updatedSubmissions, fileUrl || null).then(
          () => {
            setHasSaved(true);
          }
        );
        toast.success("Document updated successfully");
      }
    }
  }, [
    isStreamingComplete,
    hasSaved,
    uid,
    summaryID,
    summary,
    gradingData,
    grade,
    fileUrl,
    userDoc?.submissions
  ]);

  // Handle fixing grammar and spelling
  const handleFixGrammarSpelling = async () => {
    setActive(false);
    setFlagged("");
    setThinking(true);
    setIsStreamingComplete(false);
    setHasSaved(false);

    try {
      const { correctedTextArray, totalCreditsUsed } = await correctGrammarAndSpelling(gradingData.text, profile.credits, profile.useCredits, uid, selectedModelId);
      const finalText = correctedTextArray.join("");
      console.log(finalText);

      if (!finalText) throw new Error("No response");

      const creditsDeducted = await minusCredits(totalCreditsUsed);

      if (!creditsDeducted) {
        throw new Error("Failed to deduct credits.");
      }

      // setSummary(finalText);
      setGradingData({ text: finalText });
      setLocalCount((prev) => prev - totalCreditsUsed);
      setThinking(false);
      setIsStreamingComplete(true);
    } catch (error) {
      console.error(error);
      setThinking(false);
      setFlagged(
        "No suggestions found. Servers might be overloaded right now."
      );
    }
  };

  // Scroll into view when content changes
  useEffect(() => {
    if (!flagged && summary && isStreamingComplete) {
      document.getElementById("response")?.scrollIntoView({ behavior: "smooth" });
    } else if (thinking && !summary && !flagged) {
      document.getElementById("thinking")?.scrollIntoView({ behavior: "smooth" });
    } else if (flagged) {
      document.getElementById("flagged")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [thinking, flagged, isStreamingComplete, summary]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userDoc) {
    return <div>Document not found</div>;
  }

  return (
    <div className="flex flex-col gap-y-3 mb-5">
      <div>
        <h1>{gradingData.title}</h1>
        <hr />
      </div>
      <h2 className="font-medium">( Grade: {grade} )</h2>
      <div
        onClick={() => router.push("/rubrics")}
        className="bg-primary-90 text-sm font-semibold p-2 text-center shadow-sm rounded-lg cursor-pointer"
      >
        {selectedRubric?.name ? selectedRubric.name : "Select a rubric"}
      </div>
      <div className="">
        <form className="flex flex-col gap-y-2" onSubmit={handleSubmit}>
          {/* Title */}
          <section>
            <label className="block text-primary-20 font-medium" htmlFor="title">Title</label>
            <hr />
            <input
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
            <div
              className="btn btn-shiny btn-shiny-purple-blue rounded-full size-12 sm:size-16 flex gap-x-2 md:rounded-lg md:size-fit p-3 items-center"
              onClick={handleFixGrammarSpelling}
            >
              <Wand2 size={30} />
              <p className="hidden sm:flex">Fix Grammar & Spelling</p>
            </div>
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
};

export default Document;
