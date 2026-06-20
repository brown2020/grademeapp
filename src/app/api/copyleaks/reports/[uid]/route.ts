import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/firebaseAdmin";
import { requireMatchingUid } from "@/lib/server/requestAuth";

type ReportDocument = {
  id: string;
  data: () => Record<string, unknown>;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> },
) {
  try {
    const { uid } = await params

    if (!uid) {
      return NextResponse.json(
        { error: "User ID (uid) is required." },
        { status: 400 }
      );
    }

    const authResult = await requireMatchingUid(request, uid);
    if (!authResult.ok) {
      return authResult.response;
    }

    // Fetch plagiarism reports for the user from Firestore
    const reportsSnapshot = await adminDb
      .collection("users")
      .doc(uid)
      .collection("plagiarism_reports")
      .get();

    if (reportsSnapshot.empty) {
      return NextResponse.json(
        { message: "No reports found for the specified user." },
        { status: 404 }
      );
    }

    // Map Firestore documents to JSON
    const reports = reportsSnapshot.docs.map((reportDoc: ReportDocument) => ({
      docId: reportDoc.id,
      ...reportDoc.data(),
    }));

    return NextResponse.json(reports, { status: 200 });
  } catch (error) {
    console.error("Error fetching plagiarism reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch plagiarism reports." },
      { status: 500 }
    );
  }
}
