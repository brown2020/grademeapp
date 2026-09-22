import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { adminDb } from "@/firebase/firebaseAdmin";

function verifyWebhookSignature(request: NextRequest, rawBody: string): boolean {
  const secret = process.env.COPYLEAKS_WEBHOOK_SECRET;
  if (!secret) {
    // Fail closed when secret is configured expectation; allow local/dev without secret only if explicitly unset and NODE_ENV!==production
    if (process.env.NODE_ENV === "production") return false;
    return true;
  }
  const header =
    request.headers.get("x-copyleaks-signature") ||
    request.headers.get("x-signature") ||
    request.headers.get("copyleaks-signature") ||
    "";
  if (!header) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const provided = header.replace(/^sha256=/i, "").trim();
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(provided, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ status: string }> },
) {
  const [routeParams, rawBody] = await Promise.all([params, request.text()]);
  const { status } = routeParams;

  if (!verifyWebhookSignature(request, rawBody)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const body = JSON.parse(rawBody);

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

interface WebhookBody {
  scannedDocument: {
    metadata: {
      filename: string;
    };
  };
  results: Record<string, unknown>;
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
}
