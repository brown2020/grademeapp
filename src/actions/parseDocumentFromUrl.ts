"use server";

import mammoth from "mammoth";
import { Buffer } from "buffer";
import rtfToHTML from "@iarna/rtf-to-html";
import { parseOffice } from "officeparser";
import { officeNodesToHtml, plainTextToHtml } from "@/lib/utils/documentHtml";
import { requireServerUser } from "@/lib/server/requestAuth";
import { isOwnUploadUrl, MAX_UPLOAD_BYTES } from "@/lib/server/uploadUrl";

const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const ODT = "application/vnd.oasis.opendocument.text";

type Format = "docx" | "pdf" | "odt" | "txt" | "rtf";

function detectFormat(contentType: string | null, extension: string | undefined): Format | null {
  if (contentType === DOCX) return "docx";
  if (contentType === "application/pdf") return "pdf";
  if (contentType === ODT) return "odt";
  if (contentType === "text/plain") return "txt";
  if (contentType === "application/rtf" || contentType === "text/rtf") return "rtf";
  if (contentType === "application/octet-stream" || !contentType) {
    if (extension === "docx") return "docx";
    if (extension === "pdf") return "pdf";
    if (extension === "odt") return "odt";
    if (extension === "txt") return "txt";
    if (extension === "rtf") return "rtf";
  }
  return null;
}

function rtfToHtml(rtf: string): Promise<string> {
  return new Promise((resolve, reject) => {
    rtfToHTML.fromString(rtf, (err: Error | null, html: string) =>
      err ? reject(new Error("Failed to parse RTF content.")) : resolve(html)
    );
  });
}

/**
 * Fetches the signed-in user's uploaded draft from Firebase Storage and returns
 * editor HTML. Throws on anything it cannot parse, so callers never load an
 * error message into the editor as if it were the essay.
 */
export async function parseDocumentFromUrl(fileUrl: string): Promise<string> {
  const { uid } = await requireServerUser();
  if (typeof fileUrl !== "string" || !isOwnUploadUrl(fileUrl, uid, process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET)) {
    throw new Error("Only your own uploaded files can be parsed.");
  }

  const response = await fetch(fileUrl, { redirect: "error" });
  if (!response.ok) throw new Error("Couldn't download the uploaded file.");
  if (Number(response.headers.get("content-length") ?? 0) > MAX_UPLOAD_BYTES) {
    throw new Error("That file is over 10 MB.");
  }
  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength > MAX_UPLOAD_BYTES) throw new Error("That file is over 10 MB.");

  const extension = new URL(fileUrl).pathname.split(".").pop()?.toLowerCase();
  const format = detectFormat(response.headers.get("content-type"), extension);
  const buffer = Buffer.from(arrayBuffer);

  switch (format) {
    case "docx":
      return (await mammoth.convertToHtml({ buffer })).value;
    case "pdf":
    case "odt":
      // The type hint is required: buffer auto-detection fails inside the Next server bundle.
      return officeNodesToHtml((await parseOffice(buffer, { fileType: format })).content);
    case "txt":
      return plainTextToHtml(new TextDecoder().decode(arrayBuffer));
    case "rtf":
      return rtfToHtml(new TextDecoder().decode(arrayBuffer));
    default:
      throw new Error("Unsupported file type. Upload a DOCX, PDF, ODT, RTF or TXT file.");
  }
}
