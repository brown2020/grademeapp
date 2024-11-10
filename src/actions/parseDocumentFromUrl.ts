/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import mammoth from "mammoth";
import PDFParser from "pdf2json";
import { Buffer } from "buffer";
import { extractTextFromPDF } from "@/utils/pdfFormatter";
import rtfToHTML from "@iarna/rtf-to-html";
import officeParser from "officeparser";


export async function parseDocumentFromUrl(fileUrl: string): Promise<string> {
  try {
    console.log(`Starting to parse document from URL: ${fileUrl}`);

    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file from URL: ${fileUrl}`);
    }

    const contentType = response.headers.get("content-type");
    console.log("Detected content type:", contentType);

    const arrayBuffer = await response.arrayBuffer();
    console.log("Fetched array buffer, length:", arrayBuffer.byteLength);

    let parsedHtml = "";

    // Helper function to determine file extension
    const getFileExtension = (url: string) => {
      const path = url.split("?")[0]; // Remove query parameters
      return path.split(".").pop()?.toLowerCase();
    };
    const fileExtension = getFileExtension(fileUrl);
    console.log("Detected file extension:", fileExtension);

    if (contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // console.log("Processing as DOCX file with Mammoth.");
      const buffer = Buffer.from(arrayBuffer);
      const result = await mammoth.convertToHtml({ buffer });
      parsedHtml = result.value;
      console.log("Parsed DOCX content:", parsedHtml.substring(0, 100)); // Log a preview of the result
    } else if (contentType === "application/pdf") {
      console.log("Processing as PDF file with pdf2json.");
      const buffer = Buffer.from(arrayBuffer);
      const pdfParser = new PDFParser(null, true);

      const rawText = await new Promise<string>((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", (errMsg) => {
          console.error("PDF parsing error:", errMsg.parserError);
          reject(new Error(errMsg.parserError.message));
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
      console.log("Parsed PDF content:", parsedHtml.substring(0, 100)); // Log a preview of the result
    } else if (
      contentType === "text/plain" ||
      contentType === "application/vnd.oasis.opendocument.text" ||
      (contentType === "application/octet-stream" && fileExtension === "txt")
    ) {
      console.log("Processing as plain text or TXT file.");
      const rawText = new TextDecoder().decode(arrayBuffer);
      parsedHtml = rawText.replace(/\n/g, "<br>");
      console.log("Parsed TXT content:", parsedHtml.substring(0, 100)); // Log a preview of the result
    } else if (contentType === "application/octet-stream" && fileExtension === "odt") {
      // console.log("Processing as ODT file with fallback plain text handling.");

      const buffer = Buffer.from(arrayBuffer);
      const rawText = await new Promise<string>((resolve, reject) => {
        officeParser.parseOffice(buffer, (data: string, err: Error | null) => {
          if (err) {
            console.error('ODT parsing error:', err);
            reject(new Error('Failed to parse ODT content.'));
          } else if (data) {
            resolve(data);
          } else {
            reject(new Error('No data returned from ODT parser.'));
          }
        });
      });

      parsedHtml = `<html><body><p>${rawText.replace(/\n/g, '</p><p>')}</p></body></html>`;


      // console.log("Parsed ODT content:", parsedHtml); // Log a preview of the result

    } else if (contentType === "application/rtf" || (contentType === "application/octet-stream" && fileExtension === "rtf")) {
      // console.log("Processing as RTF file with fallback plain text handling.");

      const rawText = new TextDecoder().decode(arrayBuffer);

      // Use @iarna/rtf-to-html to convert RTF content to HTML
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

      // console.log("Parsed RTF content:", parsedHtml); // Log a preview of the result
    } else {
      console.warn("Unrecognized content type and file extension. File may not be supported.");
    }

    // console.log("Parsing complete.", parsedHtml);
    return parsedHtml;
  } catch (error) {
    console.error("Failed to parse document:", error);
    return `Failed to parse document: ${(error as Error).message}`;
  }
}
