import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/firebaseAdmin";
import { requireMatchingUid } from "@/lib/server/requestAuth";
import { debitCredits, InsufficientCreditsError } from "@/lib/server/billing";
import { undoFailedScan } from "@/lib/server/plagiarismReport";
import { countWords, estimateScanCredits, htmlToPlainText } from "@/components/plagiarism/report";
import { Buffer } from "buffer";

const MAX_SCAN_CHARS = 200_000;

async function getCopyleaksToken() {
  const response = await fetch("https://id.copyleaks.com/v3/account/login/api", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      email: process.env.COPYLEAKS_EMAIL,
      key: process.env.COPYLEAKS_API_KEY,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate with Copyleaks.");
  }

  const { access_token } = await response.json();
  return access_token;
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

  const baseUrl = process.env.BASE_URL;
  const webhookSecret = process.env.COPYLEAKS_WEBHOOK_SECRET;
  let charged: { uid: string; amount: number; docId?: string } | null = null;

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

    if (typeof text !== "string" || !text.trim() || text.length > MAX_SCAN_CHARS) {
      return NextResponse.json(
        { error: "Text cannot be empty." },
        { status: 400 }
      );
    }

    if (!baseUrl || !webhookSecret || !process.env.COPYLEAKS_API_KEY || !process.env.COPYLEAKS_EMAIL) {
      return NextResponse.json({ error: "Plagiarism scans are not configured." }, { status: 503 });
    }

    const scanText = htmlToPlainText(text);
    const wordCount = countWords(scanText);
    const creditCost = estimateScanCredits(scanText);

    // Check and debit atomically before the paid Copyleaks call; refunded below on failure.
    let credits: number;
    try {
      credits = await debitCredits(uid, creditCost);
    } catch (error) {
      if (error instanceof InsufficientCreditsError) {
        return NextResponse.json(
          { error: "You don't have enough credits for this scan." },
          { status: 402 }
        );
      }
      throw error;
    }
    charged = { uid, amount: creditCost };

    // Save document to Firestore
    const { docId } = await saveDocument({ uid, text: scanText, wordCount, creditCost });
    charged = { uid, amount: creditCost, docId };

    const scanId = (`${docId}`).toLowerCase(); // Encode `uid` in `scanId`

    const base64Text = Buffer.from(scanText).toString("base64");

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
          developerPayload: `${uid}/${docId}`,
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
            status: `${baseUrl}/api/copyleaks/webhook/{STATUS}`,
            statusHeaders: [["x-copyleaks-secret", webhookSecret]],
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit scan.");
    }

    charged = null;
    return NextResponse.json(
      { message: "Scan submitted successfully", docId, creditsUsed: creditCost, credits },
      { status: 201 }
    );
  } catch (error) {
    if (charged) {
      await undoFailedScan(charged).catch((refundError) =>
        console.error("Failed to refund plagiarism credits:", refundError)
      );
    }
    console.error("Error in submit handler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
