"use client";

import { useCallback, useState, useEffect } from "react";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore from "@/zustand/useProfileStore";
import { PulseLoader } from "react-spinners";
import { generateGrade } from "@/actions/generateResponse";
import { readStreamableValue } from "ai/rsc";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";

// Define types for the saveHistory function
async function saveHistory(
  uid: string | null,
  prompt: string,
  response: string,
  topic: string
): Promise<void> {
  if (!uid) return;

  const docRef = doc(collection(db, "users", uid, "summaries"));
  await setDoc(docRef, {
    id: docRef.id,
    prompt,
    response,
    topic,
    timestamp: Timestamp.now(),
  });
  console.log("History saved successfully.");
}

export default function Tools() {
  const { uid } = useAuthStore();
  const { profile, minusCredits } = useProfileStore();
  const [prompt, setPrompt] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [flagged, setFlagged] = useState<string>("");
  const [active, setActive] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>("");
  const [words, setWords] = useState<string>("");
  const [thinking, setThinking] = useState<boolean>(false);
  const [localCount, setLocalCount] = useState<number>(profile.credits);
  const [isStreamingComplete, setIsStreamingComplete] =
    useState<boolean>(false);
  const [hasSaved, setHasSaved] = useState<boolean>(false);

  // Effect to update the active state
  useEffect(() => {
    setActive(topic.length > 1 && localCount > 0);
  }, [localCount, topic]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      setActive(false);
      setSummary("");
      setFlagged("");
      setThinking(true);
      setIsStreamingComplete(false);
      setHasSaved(false);

      try {
        const userPrompt = `Please grade the essay that follows: \n${topic}`;
        const { result, creditsUsed } = await generateGrade(topic, words, profile.credits);
        
        if (!result) throw new Error("No response");

        const creditsDeducted = await minusCredits(creditsUsed);

        if (!creditsDeducted) {
          throw new Error("Failed to deduct credits.");
        }

        for await (const content of readStreamableValue(result)) {
          if (content) {
            setSummary(content.trim());
          }
        }

        setLocalCount((prev) => prev - creditsUsed);
        setPrompt(userPrompt);
        setThinking(false);
        setIsStreamingComplete(true);
      } catch (error) {
        console.error(error);
        setThinking(false);
        setFlagged(
          "No suggestions found. Servers might be overloaded right now."
        );
      }
    },
    [topic, words, minusCredits, profile.credits]
  );

  // Effect to handle saving to history
  useEffect(() => {
    if (isStreamingComplete && !hasSaved && summary) {
      saveHistory(uid, prompt, summary, topic).then(() => {
        setHasSaved(true);
      });
    }
  }, [isStreamingComplete, hasSaved, summary, uid, prompt, topic]);

  // Scroll into view when content changes
  useEffect(() => {
    if (summary) {
      document
        .getElementById("response")
        ?.scrollIntoView({ behavior: "smooth" });
    } else if (prompt) {
      document.getElementById("prompt")?.scrollIntoView({ behavior: "smooth" });
    } else if (flagged) {
      document
        .getElementById("flagged")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [summary, prompt, flagged]);

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <label htmlFor="topic-field">
          Text
          <TextareaAutosize
            id="topic-field"
            minRows={4}
            placeholder="Paste the essay to grade here."
            onChange={(e) => setTopic(e.target.value)}
            value={topic}
          />
        </label>

        <label htmlFor="words-field">
          Class level (Middle school, high school, college, etc.)
          <input
            type="text"
            id="words-field"
            placeholder="Enter the class level here."
            onChange={(e) => setWords(e.target.value)}
            value={words}
          />
        </label>

        <div className="flex flex-row gap-10">
            <button className="bottom flex" type="submit" disabled={!active}>
              Grade
            </button>
            <div className="flex">
                <h3 className="text-gray-500 font-medium">{`Credits: ${localCount}`}</h3>
            </div>
        </div>

        {!thinking && !prompt && profile.credits < 10 && (
          <h3>{`You don't have enough credits to grade.`}</h3>
        )}

        {thinking && !summary && !flagged && (
          <div className="p-5">
            <PulseLoader color="red" size={20} loading={thinking} />
          </div>
        )}

        {flagged && <h3 id="flagged">{flagged}</h3>}

        {!flagged && summary && (
          <div className="px-5 py-2 shadow-lg bg-orange-200 rounded-md">
            {/* Render Markdown content with custom styling */}
            <ReactMarkdown className="markdown">{summary}</ReactMarkdown>
          </div>
        )}
      </form>
    </div>
  );
}
