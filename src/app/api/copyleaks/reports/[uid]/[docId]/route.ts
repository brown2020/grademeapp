import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/firebaseAdmin";
import { requireMatchingUid } from "@/lib/server/requestAuth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string; docId: string }> },
) {
  try {
    const { uid, docId } = await params;

    // Validate required parameters
    if (!uid || !docId) {
      return NextResponse.json(
        { error: "User ID (uid) and Document ID (docId) are required." },
        { status: 400 }
      );
    }

    const authResult = await requireMatchingUid(request, uid);
    if (!authResult.ok) {
      return authResult.response;
    }

    // Fetch the report document from Firestore
    const reportDoc = await adminDb
      .collection("users")
      .doc(uid)
      .collection("plagiarism_reports")
      .doc(docId)
      .get();

    if (!reportDoc.exists) {
      console.error("Report document not found:", { uid, docId });
      return NextResponse.json(
        { error: "Report not found." },
        { status: 404 }
      );
    }

    // Return the report data
    return NextResponse.json(reportDoc.data(), { status: 200 });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
