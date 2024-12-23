"use server";

import { NextRequest } from "next/server";
import fetch from "node-fetch";
import { adminDb } from "@/firebase/firebaseAdmin";
import { Buffer } from "buffer";

const COPYLEAKS_API_KEY = process.env.COPYLEAKS_API_KEY;
const COPYLEAKS_EMAIL = process.env.COPYLEAKS_EMAIL;
const GRADE_ME_CREDIT_COST = 1 / 500; // $1 for 500 credits

async function getCopyleaksToken() {
  const response = await fetch("https://id.copyleaks.com/v3/account/login/api", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email: COPYLEAKS_EMAIL, key: COPYLEAKS_API_KEY }),
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate with Copyleaks.");
  }

  const { access_token } = await response.json();
  return access_token;
}

interface CalculateWordCostParams {
  wordCount: number;
}

function calculateWordCost({ wordCount }: CalculateWordCostParams): number {
  const copyleaksCredits = Math.ceil(wordCount / 250); // 1 Copyleaks credit per 250 words
  const costInDollars = (17 / 100) * copyleaksCredits; // Copyleaks cost: $17 for 100 credits
  const gradeMeCost = costInDollars * 1.5; // Add 50% margin
  const gradeMeCredits = Math.ceil(gradeMeCost / GRADE_ME_CREDIT_COST); // Convert to GradMe credits
  return gradeMeCredits;
}

interface SaveDocumentParams {
  uid: string;
  text: string;
  wordCount: number;
  creditCost: number;
}

async function saveDocument({ uid, text, wordCount, creditCost }: SaveDocumentParams) {
  // Add a new document to the user's "plagiarism-reports" subcollection
  const docRef = await adminDb
    .collection("users")
    .doc(uid)
    .collection("plagiarism_reports")
    .add({
      status: "pending",
      text,
      wordCount,
      creditCost,
      createdAt: new Date().toISOString(),
    });

  // Return the document ID
  return { docId: docRef.id };
}

export async function POST(request: NextRequest) {
  try {
    const { uid, text } = await request.json();

    if (!text.trim()) {
      return new Response(JSON.stringify({ error: "Text cannot be empty." }), {
        status: 400,
      });
    }

    const wordCount = text.split(/\s+/).length; // Count words in the text
    const creditCost = calculateWordCost(wordCount);

    // Fetch user credits
    const userDocRef = adminDb.collection("users").doc(uid);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      return new Response(
        JSON.stringify({ error: "User not found." }),
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const availableCredits = userData?.credits || 0;

    if (availableCredits < creditCost) {
      return new Response(
        JSON.stringify({
          error: "Insufficient credits. Please purchase more credits.",
        }),
        { status: 402 } // HTTP 402 Payment Required
      );
    }

    // Save document to Firestore
    const { docId } = await saveDocument({ uid, text, wordCount, creditCost });

    console.log(`Document saved with ID: ${docId}`);


    const scanId = (`${docId}`).toLowerCase(); // Encode `uid` in `scanId`

    console.log(`Scan ID: ${scanId}`);

    const base64Text = Buffer.from(text).toString("base64");

    console.log(`Base64 text: ${base64Text}`);

    const token = await getCopyleaksToken();
    console.log(`Copyleaks token: ${token}`);

    // Submit to Copyleaks
    const response = await fetch(`https://api.copyleaks.com/v3/scans/submit/file/${scanId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base64: base64Text,
        filename: `${uid}-${docId}.txt`,
        properties: {
          action: 0,
          includeHtml: true,
          sandbox: false,
          expiration: 480,
          aiGeneratedText: {
            detect: true,
            explain: {
              enable: true
            }
          },
          scanMethodAlgorithm: 0,
          sensitivityLevel: 2,
          webhooks: {
            status: `https://c559-126-61-171-196.ngrok-free.app/api/copyleaks/webhook/{STATUS}`,
          },

        },
      }),
    });


    if (!response.ok) {
      const error = await response.json();
      console.log("Error submitting scan:", error);
      throw new Error(error.message || "Failed to submit scan.");
    }

    // Deduct credits
    await userDocRef.update({
      credits: availableCredits - creditCost,
    });

    return new Response(
      JSON.stringify({ message: "Scan submitted successfully", docId }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in submit handler:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
