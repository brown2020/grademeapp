"use client";

import DocumentShell from "./DocumentShell";
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

const fetchDocumentById = async (uid: string, id: string) => {
  const docRef = firestoreDoc(db, "users", uid, "summaries", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? [docSnap.data()] : [];
};

interface DocumentProps {
  onModelChange?: (id: string) => void
}

const Document = ({ onModelChange }: DocumentProps) => {
  const { uid } = useAuthStore();
  const { profile, minusCredits } = useProfileStore();
  const { selectedRubric, gradingData, setGradingData } = useRubricStore();
  const params = useParams();
  const summaryID = params?.summaryID as string;
  const timestamp = params?.timestamp as string;
  const [userDoc, setUserDoc] = useState<UserHistoryType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [grade, setGrade] = useState<string>("");
  const [thinking, setThinking] = useState<boolean>(false);
  const localCount = profile.credits;
  const isStreamingCompleteRef = useRef(false);
  const hasSavedRef = useRef(false);
  const [summary, setSummary] = useState<string>("");
  const [flagged, setFlagged] = useState<string>("");
  const active = (gradingData.text.length > 1) && (localCount > 0 || !profile.useCredits) && !thinking;
  const [fileUrl, setFileUrl] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useLocalStorage<string>(
    'selectedModel',
    getDefaultModelId(models)
  )
  const router = useRouter();

  // Derive timestamp from the route (no effect sync)
  const timestampMillis = Number(timestamp);
  const submissionTimestamp = useMemo(
    () => Timestamp.fromMillis(timestampMillis),
    [timestampMillis]
  );

  // Load the requested document (cancelled on unmount)
  useEffect(() => {
    if (!uid || !summaryID || !submissionTimestamp) return;
    let cancelled = false;
    toast.loading("Loading document...");
    void (async () => {
      try {
        const doc = await fetchDocumentById(uid as string, summaryID as string);
        if (cancelled) return;
        const loaded = doc[0] as UserHistoryType;
        setUserDoc(loaded);
        const matchingSubmission = loaded.submissions.find((sub) =>
          sub.timestamp.seconds === submissionTimestamp.seconds &&
          sub.timestamp.nanoseconds === submissionTimestamp.nanoseconds
        );
        if (matchingSubmission) {
          setGradingData({
            title: loaded.userInput.title,
            text: matchingSubmission.text,
            assigner: loaded.userInput.assigner,
            textType: loaded.userInput.textType,
            topic: loaded.userInput.topic,
            prose: loaded.userInput.prose,
            audience: loaded.userInput.audience,
            wordLimitType: loaded.userInput.wordLimitType as
              | "less than"
              | "more than"
              | "between",
            wordLimit: loaded.userInput.wordLimit,
            customRubric: loaded.userInput.customRubric,
            rubric: loaded.userInput.rubric,
          });
          setSummary(matchingSubmission.response);
          setGrade(matchingSubmission.grade);
          setFileUrl(loaded.fileUrl);
        }
        toast.dismiss();
        toast.success("Document loaded successfully", { id: "loading" });
      } catch (error) {
        if (cancelled) return;
        console.error("Error in getDocument", error);
        toast.error("Failed to load document");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uid, summaryID, submissionTimestamp, setGradingData]);


  const saveSubmissionToHistory = useCallback(async (finalSummary: string, finalGrade: string) => {
    if (!uid || !summaryID) return;
    const newSubmission = {
      text: gradingData.text,
      response: finalSummary,
      grade: finalGrade,
      timestamp: Timestamp.now(),
    };
    const updatedSubmissions = userDoc?.submissions
      ? [...userDoc.submissions, newSubmission]
      : [newSubmission];
    await updateDocument(uid, summaryID, gradingData, updatedSubmissions, fileUrl || null);
    hasSavedRef.current = true;
    toast.success("Document updated successfully");
  }, [uid, summaryID, gradingData, fileUrl, userDoc?.submissions]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setThinking(true);
    setSummary("");
    setFlagged("");
    isStreamingCompleteRef.current = false;
    hasSavedRef.current = false;

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

      const rubricString = JSON.stringify(rubric);

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
        rubricString,
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

      let finalSummary = "";
      let finalGrade = "";
      for await (const content of readStreamableValue(result)) {
        if (content) {
          finalSummary = content.trim();
          finalGrade = extractGrade(finalSummary);
          setSummary(finalSummary);
          setGrade(finalGrade);
        }
      }

      setThinking(false);
      isStreamingCompleteRef.current = true;
      void saveSubmissionToHistory(finalSummary, finalGrade);
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
    [gradingData, minusCredits, profile.credits, profile.identity, profile.identityLevel, profile.useCredits, selectedModelId, uid, saveSubmissionToHistory]
  );


  // Handle fixing grammar and spelling
  const handleFixGrammarSpelling = async () => {
    setFlagged("");
    setThinking(true);
    isStreamingCompleteRef.current = false;
    hasSavedRef.current = false;

    try {
      const { correctedTextArray, totalCreditsUsed } = await correctGrammarAndSpelling(gradingData.text, profile.credits, profile.useCredits, uid, selectedModelId);
      const finalText = correctedTextArray.join("");
      if (!finalText) throw new Error("No response");

      const creditsDeducted = await minusCredits(totalCreditsUsed);

      if (!creditsDeducted) {
        throw new Error("Failed to deduct credits.");
      }

      // setSummary(finalText);
      setGradingData({ text: finalText });
      setThinking(false);
      isStreamingCompleteRef.current = true;
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
    if (!flagged && summary && isStreamingCompleteRef.current) {
      document.getElementById("response")?.scrollIntoView({ behavior: "smooth" });
    } else if (thinking && !summary && !flagged) {
      document.getElementById("thinking")?.scrollIntoView({ behavior: "smooth" });
    } else if (flagged) {
      document.getElementById("flagged")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [thinking, flagged, isStreamingCompleteRef, summary]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userDoc) {
    return <div>Document not found</div>;
  }


  return (
    <DocumentShell
      key={`${flagged}-${summary}-${grade}`}
      active={active}
      thinking={thinking}
      localCount={localCount}
      profile={profile}
      gradingData={gradingData}
      setGradingData={setGradingData}
      summary={summary}
      flagged={flagged}
      fileUrl={fileUrl}
      selectedModelId={selectedModelId}
      setSelectedModelId={setSelectedModelId}
      onModelChange={onModelChange}
      handleSubmit={handleSubmit}
      handleFixGrammarSpelling={handleFixGrammarSpelling}
      router={router}
      uid={uid}
      loading={loading}
      userDoc={userDoc}
      grade={grade}
      selectedRubric={selectedRubric}
      models={models}
    />
  );
};

export default Document;
