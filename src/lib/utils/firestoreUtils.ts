import { adminDb } from "@/firebase/firebaseAdmin";
import { getStorage } from "firebase-admin/storage";
import * as crypto from "crypto";

/**
 * Utility to hash essay text for duplicate detection.
 */
function hashText(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

/**
 * Stores large essay text in Firebase Storage and returns the public URL.
 */
async function storeTextInStorage(text: string, docId: string): Promise<string> {
  const storage = getStorage();
  const bucket = storage.bucket();
  const filePath = `essays/${docId}.txt`;

  const file = bucket.file(filePath);
  await file.save(text, { contentType: "text/plain" });

  // Return public URL for the stored file
  return file.publicUrl();
}

/**
 * Stores the essay in Firestore and references text in Firebase Storage.
 * Updates to include Copyleaks scan data and AI-generated report storage.
 */
export async function storeEssay(data: {
  text: string;
  source: string;
  embedding?: number[];
  title: string;
  retrievalDate: Date;
  wordCount?: number;
  tokenCount?: number;
  url?: string;
  metadata?: { author?: string; tags?: string[] };
  tags?: string[];
  language: string;
  summary?: string;
  copyleaksScanId?: string;
  aiReport?: string; // Optional field to store AI-generated reports
}) {
  const docRef = adminDb.collection("essays").doc();
  const docId = docRef.id;

  // Hash the text to check for duplicates
  const textHash = hashText(data.text);
  // const existingEssay = await adminDb
  //   .collection("essays")
  //   .where("textHash", "==", textHash)
  //   .get();

  // if (!existingEssay.empty) {
  //   throw new Error("Duplicate essay detected. The essay text already exists in the database.");
  // }

  // Store the essay text in Firebase Storage
  const textUrl = await storeTextInStorage(data.text, docId);

  // Prepare the Firestore document
  const essayDoc = {
    text: textUrl, // Store the URL to the text in Firebase Storage
    source: data.source,
    embedding: data.embedding || null,
    title: data.title,
    retrievalDate: data.retrievalDate.toISOString(),
    wordCount: data.wordCount || data.text.split(" ").length,
    tokenCount: data.tokenCount || Math.ceil(data.text.length / 4), // Estimate tokens if not provided
    url: data.url || null,
    metadata: data.metadata || {},
    tags: data.tags || [],
    language: data.language,
    summary: data.summary || null,
    copyleaksScanId: data.copyleaksScanId || null, // Optional Copyleaks scan reference
    aiReport: data.aiReport || null, // Store AI-generated report if provided
    textHash, // Used for duplicate detection
    version: 1, // Initial version
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save the document in Firestore
  await docRef.set(essayDoc);

  return { docId };
}

/**
 * Deducts credits from a user's Firestore document.
 */
export async function deductUserCredits(uid: string, creditsUsed: number) {
  const userDocRef = adminDb.collection("users").doc(uid);
  const userDoc = await userDocRef.get();

  if (!userDoc.exists) {
    throw new Error("User document does not exist.");
  }

  const userData = userDoc.data();
  const updatedCredits = (userData?.credits || 0) - creditsUsed;

  if (updatedCredits < 0) {
    throw new Error("Insufficient credits to complete the operation.");
  }

  await userDocRef.update({ credits: updatedCredits });
}

/**
 * Stores Copyleaks scan results in Firestore.
 */
export async function storeCopyleaksResults(scanId: string, results: Record<string, unknown>) {
  const docRef = adminDb.collection("copyleaksScans").doc(scanId);

  const scanData = {
    scanId,
    results,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await docRef.set(scanData);
}

/**
 * Updates the essay document with AI-generated report.
 */
export async function updateEssayWithAIReport(docId: string, aiReport: string) {
  const docRef = adminDb.collection("essays").doc(docId);
  await docRef.update({ aiReport, updatedAt: new Date().toISOString() });
}
