import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/firebaseAdmin";

export async function POST(request: NextRequest, { params }: { params: { status: string } }) {
  const { status } = params;

  try {
    const body = await request.json();

    console.log(`Webhook Received - Status: ${status}`);
    console.log("Payload:", body);

    // Handle different webhook statuses
    switch (status) {
      case "completed":
        await handleCompletedWebhook(body);
        break;

      case "error":
        console.error("Webhook reported an error:", body);
        break;

      default:
        console.warn(`Unhandled webhook status: ${status}`);
    }

    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}

// Example handler for completed webhook
interface WebhookBody {
  scannedDocument: {
    metadata: {
      filename: string;
    };
  };
  results: Record<string, unknown>; // Replace 'unknown' with the specific type if known
}

async function handleCompletedWebhook(body: WebhookBody) {
  const {
    scannedDocument: { metadata },
    results,
  } = body;

  const filename = metadata?.filename || "";
  const [uid, docId] = filename.replace(".txt", "").split("-");

  if (!uid || !docId) {
    throw new Error("Invalid filename format in webhook payload.");
  }

  // Update Firestore with results
  await adminDb
    .collection("users")
    .doc(uid)
    .collection("plagiarism_reports")
    .doc(docId)
    .update({
      status: "completed",
      results,
      updatedAt: new Date().toISOString(),
    });

  console.log(`Updated report for uid: ${uid}, docId: ${docId}`);
}
