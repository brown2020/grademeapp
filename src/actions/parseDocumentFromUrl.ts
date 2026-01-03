/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import mammoth from "mammoth";
import PDFParser from "pdf2json";
import { Buffer } from "buffer";
import { extractTextFromPDF } from "@/lib/utils/pdfFormatter";
import rtfToHTML from "@iarna/rtf-to-html";
import officeParser from "officeparser";


export async function parseDocumentFromUrl(fileUrl: string): Promise<string> {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file from URL: ${fileUrl}`);
    }

    const contentType = response.headers.get("content-type");

    const arrayBuffer = await response.arrayBuffer();

    let parsedHtml = "";

    // Helper function to determine file extension
    const getFileExtension = (url: string) => {
      const path = url.split("?")[0]; // Remove query parameters
      return path.split(".").pop()?.toLowerCase();
    };
    const fileExtension = getFileExtension(fileUrl);

    if (contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const buffer = Buffer.from(arrayBuffer);
      const result = await mammoth.convertToHtml({ buffer });
      parsedHtml = result.value;
    } else if (contentType === "application/pdf") {
      const buffer = Buffer.from(arrayBuffer);
      const pdfParser = new PDFParser(null, true);

      const rawText = await new Promise<string>((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", (errMsg) => {
          const parserError =
            errMsg instanceof Error ? errMsg : ("parserError" in errMsg ? errMsg.parserError : undefined);
          console.error("PDF parsing error:", parserError ?? errMsg);
          reject(new Error(parserError?.message ?? "Failed to parse PDF content."));
        });

        pdfParser.on("pdfParser_dataReady", (pdfData) => {
          const text = extractTextFromPDF(pdfData);
          resolve(text);
        });

        pdfParser.parseBuffer(buffer);
      });

      parsedHtml = rawText
        .split(/\n\s*\n/) // Split by double newlines for paragraphs
        .map((para) => `<p>${para.trim()}</p>`)
        .join("");
    } else if (
      contentType === "text/plain" ||
      (contentType === "application/octet-stream" && fileExtension === "txt")
    ) {
      const rawText = new TextDecoder().decode(arrayBuffer);
      parsedHtml = rawText.replace(/\n/g, "<br>");
    } else if (
      contentType === "application/vnd.oasis.opendocument.text" ||
      (contentType === "application/octet-stream" && fileExtension === "odt")
    ) {
      const buffer = Buffer.from(arrayBuffer);
      const rawText = (await officeParser.parseOffice(buffer)).toText();

      parsedHtml = `<html><body><p>${rawText.replace(/\n/g, '</p><p>')}</p></body></html>`;

    } else if (contentType === "application/rtf" || (contentType === "application/octet-stream" && fileExtension === "rtf")) {

      const rawText = new TextDecoder().decode(arrayBuffer);

      parsedHtml = await new Promise((resolve, reject) => {
        rtfToHTML.fromString(rawText, (err: Error | null, html: string) => {
          if (err) {
            console.error('RTF parsing error:', err);
            reject(new Error('Failed to parse RTF content.'));
          } else {
            resolve(html);
          }
        });
      });

    } else {
      console.warn("Unrecognized content type and file extension. File may not be supported.");
    }

    return parsedHtml;
  } catch (error) {
    console.error("Failed to parse document:", error);
    return `Failed to parse document: ${(error as Error).message}`;
  }
}
