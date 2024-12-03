"use client";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useParams } from "next/navigation";
import { UserHistoryType, Submission } from "@/lib/types/user-history";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import RubricDisplay from "@/components/rubrics/RubricDisplay";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDown, Download } from "lucide-react";
import { RubricState, BaseRubric } from "@/lib/types/rubrics-types";
import SummaryTour from "@/components/tours/SummaryTour";

// Fetch summary by ID
const fetchSummaryById = async (uid: string, id: string) => {
  const docRef = collection(db, "users", uid, "summaries");
  const docSnap = await getDocs(docRef);
  const summaryDoc = docSnap.docs.find((doc) => doc.id === id);
  return summaryDoc ? (summaryDoc.data() as UserHistoryType) : undefined;
};

const Summary = () => {
  const { uid } = useAuthStore();
  const { summaryID } = useParams();
  const [summary, setSummary] = useState<UserHistoryType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rubric, setRubric] = useState<BaseRubric | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSummary((prevSummary) => prevSummary ? { ...prevSummary, userInput: { ...prevSummary.userInput, [name]: value } } : null);
  };

  useEffect(() => {
    const getSummary = async () => {
      try {
        setLoading(true);
        toast.loading("Loading summary...");
        const summaryData = await fetchSummaryById(uid as string, summaryID as string);
        setSummary(summaryData || null);
        setRubric(summaryData?.userInput?.rubric as unknown as BaseRubric || null);
      } catch (error) {
        console.error("Error in getSummary", error);
        toast.error("Failed to load the summary.", { id: "loading" });
      } finally {
        setLoading(false);
        toast.dismiss();
        toast.success("Summary loaded successfully", { id: "loading" });
      }
    };

    if (uid && summaryID) {
      getSummary();
    }
  }, [uid, summaryID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!summary) {
    return <div>Summary not found</div>;
  }

  return (
    <div className="flex flex-col gap-y-4 p-1 max-w-2xl mx-auto">
      {/* Title, Topic, and Rubric */}
      <div>
        <div className="flex gap-x-1">
          <SummaryTour />
          <h1>Summary</h1>
        </div>
        <hr />
      </div>
      <h2 className="summary-title"><span className="font-medium">Title:</span> {summary.userInput.title}</h2>
      <p className="summary-topic">
        <span className="font-medium">Topic:</span> {summary.userInput.topic ? summary.userInput.topic :
          <input
            id="topic"
            name="topic"
            value={summary.userInput.topic}
            onChange={handleInputChange}
            placeholder="Explain the assignment"
            className="border rounded-md w-full text-sm px-2 py-1"
          />
        }
      </p>
      {/* File Download Button */}
      {summary.fileUrl && (
        <a href={summary.fileUrl} target="_blank" rel="noreferrer" className="w-full summary-download-original">
          <div
            className={
              "btn btn-shiny btn-shiny-teal w-full gap-x-4 text-lg py-1"
            }
          >
            <Download />
            <p>Download Original</p>
          </div>
        </a>
      )}
      {/* Rubric Display */}
      <div className="summary-rubric">
        <h2 className=" font-semibold">{rubric?.name}</h2>
        <p className="text-sm">{rubric?.description}</p>
        <RubricDisplay rubric={rubric as RubricState} />
      </div>

      {/* Accordion for Submissions */}
      <div className="mb-4 summary-submissions">
        <h2 className="text-lg font-semibold">Submissions</h2>

        {summary.submissions.length === 0 ? (
          <p>No submissions yet</p>
        ) : (
          summary.submissions.map((submission: Submission, index: number) => (
            <Disclosure key={index}>
              {({ open }) => (
                <>
                  <DisclosureButton className="btn btn-shiny btn-shiny-teal text-primary-95 w-full mb-3 px-2 justify-between summary-submission-item">
                    <span>
                      #{index + 1} - {submission.timestamp.toDate().toLocaleDateString('en-US')}
                    </span>
                    <span>Grade: {submission.grade}</span>
                    <Link href={`/assignments/${summaryID}/${submission.timestamp.toMillis()}`}>
                      <p className=" px-3 py-2 underline underline-offset-4 summary-revise-edit">
                        Revise and Edit
                      </p>
                    </Link>
                    <ChevronDown className={`${open ? "transform rotate-180" : ""} w-5 h-5 duration-300 ease-in-out transition`} />
                  </DisclosureButton>

                  <DisclosurePanel transition className=" place-self-center bg-secondary-97 ring ring-primary-40 rounded-lg ring-inset p-2 text-sm origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0 mb-2">
                    {/* Submitted Text */}
                    <div className="flex flex-col mb-4">
                      <h4 className="font-semibold">Submitted Text</h4>
                      <div
                        className="place-self-center prose p-3 rounded h-96 overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: submission.text || "<p>No text submitted</p>" }}
                      ></div>
                    </div>

                    {/* Feedback */}
                    <div className="flex flex-col w-fit bg-primary-95">
                      <hr />
                      <h4 className="font-semibold">Feedback</h4>
                      <div className="place-self-center prose  p-3 rounded h-96 overflow-y-auto">
                        <ReactMarkdown>{submission.response}</ReactMarkdown>
                      </div>
                    </div>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          ))
        )}
      </div>
    </div>
  );
};

export default Summary;
