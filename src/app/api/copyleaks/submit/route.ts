import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/firebaseAdmin";
import { requireMatchingUid } from "@/lib/server/requestAuth";
import { debitCredits, InsufficientCreditsError, refundCredits } from "@/lib/server/billing";
import { Buffer } from "buffer";

const COPYLEAKS_API_KEY = process.env.COPYLEAKS_API_KEY;
const COPYLEAKS_EMAIL = process.env.COPYLEAKS_EMAIL;
const GRADE_ME_CREDIT_COST = 1 / 200; // $1 for 200 credits

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

function calculateWordCost(wordCount: number): number {
  const copyleaksCredits = Math.ceil(wordCount / 250); // 1 Copyleaks credit per 250 words
  const costInDollars = (17 / 100) * copyleaksCredits; // Copyleaks cost: $17 for 100 credits
  const gradeMeCost = costInDollars * 1.5; // Add 50% margin
  const gradeMeCredits = Math.ceil(gradeMeCost / GRADE_ME_CREDIT_COST); // Convert to GradMe credits
  return Number(gradeMeCredits);
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

  const BASE_URL = process.env.BASE_URL;
  let charged: { uid: string; amount: number } | null = null;

  try {
    const body = (await request.json()) as { uid?: unknown; text?: unknown };
    const { uid, text } = body;

    if (typeof uid !== "string" || !uid) {
      return NextResponse.json(
        { error: "User ID (uid) is required." },
        { status: 400 }
      );
    }

    const authResult = await requireMatchingUid(request, uid);
    if (!authResult.ok) {
      return authResult.response;
    }

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Text cannot be empty." },
        { status: 400 }
      );
    }

    const wordCount = Number(text.split(/\s+/).length); // Count words in the text
    const creditCost = calculateWordCost(wordCount);

    // Check and debit atomically before the paid Copyleaks call; refunded below on failure.
    let credits: number;
    try {
      credits = await debitCredits(uid, creditCost);
    } catch (error) {
      if (error instanceof InsufficientCreditsError) {
        return NextResponse.json(
          { error: "Insufficient credits. Please purchase more credits." },
          { status: 402 }
        );
      }
      throw error;
    }
    charged = { uid, amount: creditCost };

    // Save document to Firestore
    const { docId } = await saveDocument({ uid, text, wordCount, creditCost });

    const scanId = (`${docId}`).toLowerCase(); // Encode `uid` in `scanId`

    const base64Text = Buffer.from(text).toString("base64");

    const token = await getCopyleaksToken();

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
            status: `${BASE_URL}/api/copyleaks/webhook/{STATUS}`,
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to submit scan.");
    }

    charged = null;
    return NextResponse.json(
      { message: "Scan submitted successfully", docId, creditsUsed: creditCost, credits },
      { status: 201 }
    );
  } catch (error) {
    if (charged) {
      await refundCredits(charged.uid, charged.amount).catch((refundError) =>
        console.error("Failed to refund plagiarism credits:", refundError)
      );
    }
    console.error("Error in submit handler:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
