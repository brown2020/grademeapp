/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import mammoth from 'mammoth'; // For parsing .docx files
import PDFParser from 'pdf2json'; // For parsing .pdf files
import { Buffer } from 'buffer'; // For handling binary data
import { extractTextFromPDF } from '@/utils/pdfFormatter'; // Import the PDF text extraction function
// import fs from 'fs'; // For file system operations

// Function to write parsed text or logs to a file
// function writeLogToFile(logData: string, fileName = 'log.txt') {
//     fs.writeFile(fileName, logData, (err) => {
//         if (err) {
//             console.error('Error writing to log file:', err);
//         } else {
//             console.log('Log successfully written to', fileName);
//         }
//     });
// }

export async function parseDocumentFromUrl(fileUrl: string): Promise<string> {

    // console.log(`Parsing document from URL: ${fileUrl}`);

    try {
        const response = await fetch(fileUrl); // Fetch the file from the URL
        if (!response.ok) {
            throw new Error(`Failed to fetch file from URL: ${fileUrl}`);
        }

        const contentType = response.headers.get("content-type");
        const arrayBuffer = await response.arrayBuffer();
        let parsedText = '';

        if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            // Parse .docx using Mammoth.js
            const buffer = Buffer.from(arrayBuffer);
            const result = await mammoth.extractRawText({ buffer });
            parsedText = result.value;
        } else if (contentType === 'application/pdf') {
            const buffer = Buffer.from(arrayBuffer);

            const pdfParser = new PDFParser(null, true);

            // Use a Promise to handle the asynchronous parsing
            const rawText = await new Promise<string>((resolve, reject) => {
                pdfParser.on('pdfParser_dataError', (errMsg: Record<"parserError", Error>) => {
                    console.error('Error while parsing PDF:', errMsg.parserError);
                    reject(new Error(errMsg.parserError.message));
                });

                pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
                    // console.log('Full PDF Data:', JSON.stringify(pdfData, null, 2));
                    // writeLogToFile(JSON.stringify(pdfData, null, 2), 'parsed_output.txt'); // Write the parsed text to a file
                    const parsedText = extractTextFromPDF(pdfData); // Extract text from PDF JSON data
                    resolve(parsedText); // Resolve the Promise with the parsed text
                });

                // Parse the PDF buffer
                pdfParser.parseBuffer(buffer);
            });

            // Process raw text to insert spaces between words
            parsedText = rawText;


        } else if (contentType === 'application/vnd.oasis.opendocument.text' || contentType === 'text/plain') {
            // Handle .odt and .txt parsing
            parsedText = new TextDecoder().decode(arrayBuffer);
        }

        // console.log(parsedText);
        return parsedText;
    } catch (error) {
        console.error('Failed to parse document:', error);
        return `Failed to parse document: ${(error as Error).message}`;
    }
}