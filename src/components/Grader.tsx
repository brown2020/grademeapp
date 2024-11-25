"use client";

import { useCallback, useState, useEffect, FormEvent } from "react";
import { Timestamp } from "firebase/firestore";
import { storage } from "@/firebase/firebaseClient";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore from "@/zustand/useProfileStore";
import { generateGrade } from "@/actions/generateResponse";
import { parseDocumentFromUrl } from "@/actions/parseDocumentFromUrl";
import { readStreamableValue } from "ai/rsc";
import ReactMarkdown from "react-markdown";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Paperclip, RefreshCwIcon } from "lucide-react"
import { extractGrade } from "@/utils/responseParser";
import { saveDocument } from "@/utils/saveHistory";
import { useRubricStore } from "@/zustand/useRubricStore";
import CustomButton from "@/components/ui/CustomButton";
import Tiptap from "@/components/tiptap/Tiptap";
import Image from "next/image";
import grademe from "@/app/assets/grademe.svg";
import GraderTour from "@/components/tours/GraderTour";

export default function Grader() {
  const { uid } = useAuthStore();
  const { selectedRubric, gradingData, setGradingData } = useRubricStore();
  const { profile, minusCredits } = useProfileStore();
  const [response, setResponse] = useState<string>("");
  const [flagged, setFlagged] = useState<string>("");
  const [active, setActive] = useState<boolean>(false);
  const [grade, setGrade] = useState<string>("");
  const [thinking, setThinking] = useState<boolean>(false);
  const [localCount, setLocalCount] = useState<number>(profile.credits);
  const [isStreamingComplete, setIsStreamingComplete] = useState<boolean>(false);
  const [hasSaved, setHasSaved] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>("");
  const router = useRouter();

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile && uid) {
      setUploading(true);
      toast.loading("Uploading file...");

      // Log file information for debugging
      console.log('Uploading file:', selectedFile.name, 'of type:', selectedFile.type, 'and size:', selectedFile.size);

      try {
        const { setGradingData } = useRubricStore.getState();

        const fileNameWithoutExtension = ((selectedFile.name).split('.')[0]);
        setGradingData({ title: fileNameWithoutExtension });

        const fileRef = ref(storage, `uploads/${uid}/${selectedFile.name}`);
        await uploadBytes(fileRef, selectedFile);

        const downloadURL = await getDownloadURL(fileRef);
        setFileUrl(downloadURL);

        const parsedText = await parseDocumentFromUrl(downloadURL);
        // console.log('Parsed text:', parsedText);

        setGradingData({ text: parsedText });

        setUploading(false);
        toast.dismiss();
        toast.success('File uploaded successfully.');
      } catch (error) {
        toast.dismiss();
        toast.error('Failed to upload file. Please try again.');
        console.error('Failed to upload file:', error);
      }
    } else if (!uid) {
      toast.error('Please log in to upload a file.');
      console.error('User is not authenticated');
    }
  };

  // Enable submit button if conditions are met
  useEffect(() => {
    setActive(gradingData.text.length > 1 && localCount > 0 && !uploading);
  }, [localCount, gradingData.text, uploading]);


  // Handle form submission
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setActive(false);
    setResponse("");
    setFlagged("");
    setThinking(true);
    setIsStreamingComplete(false);
    setHasSaved(false);

    // convert rubric to string
    const rubricString = JSON.stringify(selectedRubric);
    setGradingData({ rubric: selectedRubric });

    try {
      const { result, creditsUsed } = await generateGrade(
        profile.identity || "",
        profile.identityLevel || "",
        gradingData.assigner,
        gradingData.topic,
        gradingData.prose,
        gradingData.audience,
        gradingData.wordLimitType,
        gradingData.wordLimit,
        gradingData.title,
        gradingData.text,
        rubricString,
        profile.credits
      );

      if (!result) throw new Error("No response");

      const creditsDeducted = await minusCredits(creditsUsed);

      if (!creditsDeducted) {
        throw new Error("Failed to deduct credits.");
      }

      for await (const content of readStreamableValue(result)) {
        if (content) {
          setResponse(content.trim());
          setGrade(extractGrade(content.trim()));
        }
      }

      setLocalCount((prev) => prev - creditsUsed);
      setThinking(false);
      setIsStreamingComplete(true);
    } catch (error) {
      console.error(error);
      setThinking(false);
      setFlagged(
        "No suggestions found. Servers might be overloaded right now."
      );
    }
  }, [gradingData, profile.credits, minusCredits, profile.identity, profile.identityLevel]);

  // Effect to handle saving to history
  useEffect(() => {
    if (isStreamingComplete && !hasSaved && response) {
      console.log(fileUrl)
      saveDocument(uid, gradingData, [{ text: gradingData.text, response: response, grade, timestamp: Timestamp.now() }], fileUrl).then(() => {
        setHasSaved(true);
      });
    }
  }, [isStreamingComplete, hasSaved, response, uid, gradingData, grade, fileUrl]);

  // Scroll into view when content changes
  useEffect(() => {
    if (response) {
      document.getElementById("response")?.scrollIntoView({ behavior: "smooth" });
    }
    else if (flagged) {
      document.getElementById("flagged")?.scrollIntoView({ behavior: "smooth" });
    } else if (thinking) {
      document.getElementById("thinking")?.scrollIntoView({ behavior: "smooth" });
    } else if (uploading == false) {
      document.getElementById("grademe")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [response, flagged, thinking, uploading]);

  return (
    <main className="flex flex-col gap-y-4 pb-10 md:pb-0">
      <div>
        <div className="flex gap-x-1 items-center">
          <GraderTour />
          <h1>Grader</h1>
        </div>
        <hr />
      </div>
      <section className="flex flex-col grader-selected-rubric">
        <div>
          <h2 className="block text-primary-30 font-medium">Selected Rubric</h2>
          <hr />
        </div>
        <div
          onClick={() => router.push("/rubrics")}
          className="place-self-center md:place-self-start w-fit border border-primary-40 text-sm font-semibold p-2 bg-primary-90 text-center shadow-sm rounded-lg cursor-pointer"
        >
          {selectedRubric?.name ? selectedRubric.name : "Select a rubric"}
        </div>
      </section>
      <section className="flex flex-col gap-y-4">
        <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
          {/* Title */}
          <section>
            <label className="block text-primary-30 font-medium" htmlFor="title">Title</label>
            <hr />
            <input
              type="text"
              name="title"
              id="title"
              value={gradingData.title}
              onChange={(e) => setGradingData({ title: e.target.value })}
              placeholder="Enter the title here"
              className="input-secondary grader-title"
            />
          </section>
          {/* Text Editor and File Upload */}
          <section>
            <div className="relative grader-text">
              <label className="block font-medium text-primary-30" htmlFor="text">Text</label>
              <hr />
              <Tiptap
                wordLimit={gradingData.wordLimit}
                wordLimitType={gradingData.wordLimitType}
                editorContent={gradingData.text}
                onChange={(text) => setGradingData({ text })}
              />
            </div>
          </section>
          {/* Submit Button */}
          <section className="flex flex-row items-center w-full gap-x-8 justify-center sm:justify-start">
            {/* Submit Button */}
            <button
              type="submit"
              id="grademe"
              onClick={handleSubmit}
              disabled={!active || uploading}
              className={`btn btn-shiny border-2 border-primary-40 rounded-full size-16 p-2 grader-grademe-button ${!active ? "cursor-not-allowed" : ""}`}
            >
              <Image alt={"grademe logo"} src={grademe} width={40} height={40} className="bg-secondary-97 rounded-full p-1 size-14" />
            </button>
            {/* File Upload */}
            <div
              className="btn btn-shiny overflow-visible size-16 flex items-center bg-secondary-97 border-2 border-primary-40 rounded-full p-1.5 grader-file-upload"
              onClick={() => document.getElementById("file-upload")?.click()} // Trigger input click on div click
            >
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex items-center justify-center peer"
                onClick={(e) => e.stopPropagation()} // Prevent label click from propagating
              >
                <Paperclip size={40} className="place-self-center place-items-center text-primary-30" />
              </label>
              {/* Hidden file input */}
              <input
                id="file-upload"
                type="file"
                accept=".docx,.pdf,.odt,.txt,.rtf"
                className="hidden"
                onChange={handleFileChange}
              />
              {/* Tooltip */}
              <div className="absolute left-12 -top-4 w-fit px-2 py-1 bg-secondary-20 text-xs text-primary-90 rounded opacity-0 hidden peer-hover:opacity-100 peer-hover:flex transition-opacity z-20">
                Upload a file (docx, pdf, odt, rtf, txt)
              </div>
            </div>
            <CustomButton onClick={() => {
              setGradingData({ title: "", text: "" });
            }}
              className="size-16 btn btn-shiny flex items-center bg-secondary-97 border-2 border-primary-40 rounded-full p-1.5 grader-reset-button">
              <RefreshCwIcon size={25} className="place-self-center place-items-center text-primary-30" />
            </CustomButton>
          </section>
        </form>

        {thinking && <Image alt={"grademe logo"} src={grademe} width={100} height={100} className=" animate-bounce duration-1000 place-self-center" />}

        {response && (
          <div id="response" className="px-5 py-2 shadow-lg bg-secondary-90 rounded-md">
            <div className="flex gap-x-2 items-center justify-center">
              <Image alt={"grademe logo"} src={grademe} width={40} height={40} className="size-14" />
              <h2 className="text-2xl text-center text-primary-10 font-medium">Grade.me Report</h2>
            </div>

            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        )}
      </section>
    </main>
  );
}