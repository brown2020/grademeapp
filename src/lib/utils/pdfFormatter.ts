/* eslint-disable @typescript-eslint/no-explicit-any */

import decodeURIComponent from 'decode-uri-component'; // For decoding URL-encoded text

// Helper function to extract and properly format the text from PDF JSON data
export function extractTextFromPDF(pdfData: any): string {
  let resultText = '';
  let lastX = 0.0; // To track the last x-coordinate for word separation
  let lastY = 0.0; // To track the last y-coordinate for line breaks
  const lineBreakThreshold = 0.9; // Vertical threshold for inserting line breaks
  let currentWord = ''; // Temporary store for building words
  let startLine = true; // Flag to track the start of a new line
  let prevChar = ''; // Store the previous character for comparison
  let isFirstLine = true;

  if (pdfData?.Pages) {
    pdfData.Pages.forEach((page: any) => {
      page.Texts.forEach((textBlock: any) => {
        const currentX = textBlock.x;
        const currentY = textBlock.y;

        // Insert a line break if the vertical distance is significant
        if (currentY - lastY > lineBreakThreshold && !isFirstLine) {
          if (currentWord) {
            resultText += currentWord + ' ';
            currentWord = ''; // Clear the word buffer
          }
          resultText += '\n';
          startLine = true;
        }

        textBlock.R.forEach((textItem: any) => {
          const decodedText = decodeURIComponent(textItem.T); // Decode URL-encoded text
          const xDiff = currentX - lastX; // Calculate horizontal difference

          if (!startLine && prevChar) {
            // Check if we should insert a space based on X-difference
            if (shouldInsertSpace(prevChar.trim(), xDiff)) {
              resultText += currentWord + ' '; // Complete the word and add space
              currentWord = '';
            }
          } else {
            startLine = false; // Reset flag after the first character
          }

          currentWord += decodedText.trim(); // Append character to current word
          prevChar = decodedText; // Update previous character
          lastX = currentX; // Update lastX for next comparison
        });

        lastY = currentY; // Update last y-coordinate for the next line
        isFirstLine = false;
      });

      // Append any remaining word after processing the page
      if (currentWord) {
        resultText += currentWord + ' ';
        currentWord = ''; // Clear word buffer
      }
    });
  } else {
    console.error("Unexpected PDF structure. Couldn't find Pages.");
    resultText = 'Error: PDF structure not recognized.';
  }

  return resultText;
}

function shouldInsertSpace(prevChar: string, xDiff: number): boolean {
  const key = prevChar;

  // Check if it's lowercase or uppercase and return the threshold
  if (/[a-z]/.test(prevChar)) {

    return xDiff > (lowercaseXDiffs[key]);
  } else if (/[A-Z]/.test(prevChar)) {

    return xDiff > (uppercaseXDiffs[key]);
  } else if (/[.,?!"#$%&'()@[\]{}+:;\-=]/.test(prevChar)) {
    // If the current character is a punctuation mark, insert space

    return xDiff > puncDiffs[key];
  } else if (/[0-9]/.test(prevChar)) {
    // If the previous character is a digit, insert space
    return xDiff > digitDiffs[key];
  }

  else {
    return false;
  }
}

const lowercaseXDiffs: Record<string, number> = {
  "a": 0.384,
  "b": 0.385,
  "c": 0.345,
  "d": 0.384,
  "e": 0.384,
  "f": 0.193,
  "g": 0.384,
  "h": 0.384,
  "i": 0.155,
  "j": 0.153,
  "k": 0.346,
  "l": 0.155,
  "m": 0.575,
  "n": 0.385,
  "o": 0.384,
  "p": 0.383,
  "q": 0.383,
  "r": 0.231,
  "s": 0.345,
  "t": 0.192,
  "u": 0.385,
  "v": 0.345,
  "w": 0.497,
  "x": 0.345,
  "y": 0.345,
  "z": 0.344
};

const uppercaseXDiffs: Record<string, number> = {
  "A": 0.460,
  "B": 0.460,
  "C": 0.498,
  "D": 0.497,
  "E": 0.459,
  "F": 0.421,
  "G": 0.535,
  "H": 0.497,
  "I": 0.191,
  "J": 0.345,
  "K": 0.459,
  "L": 0.383,
  "M": 0.572,
  "N": 0.497,
  "O": 0.536,
  "P": 0.459,
  "Q": 0.535,
  "R": 0.497,
  "S": 0.460,
  "T": 0.420,
  "U": 0.497,
  "V": 0.459,
  "W": 0.648,
  "X": 0.459,
  "Y": 0.459,
  "Z": 0.459
};

const digitDiffs: Record<string, number> = {
  "0": 0.384,
  "1": 0.384,
  "2": 0.384,
  "3": 0.384,
  "4": 0.384,
  "5": 0.384,
  "6": 0.384,
  "7": 0.384,
  "8": 0.384,
  "9": 0.384
};

const puncDiffs: Record<string, number> = {
  ".": 0.192,
  ",": 0.192,
  "?": 0.382,
  "!": 0.192,
  "\"": 0.244,
  "#": 0.384,
  "$": 0.383,
  "%": 0.614,
  "&": 0.459,
  "'": 0.134,
  "(": 0.230,
  ")": 0.230,
  "@": 0.698,
  "[": 0.192,
  "]": 0.192,
  "{": 0.230,
  "}": 0.230,
  "+": 0.402,
  ":": 0.192,
  ";": 0.190,
  "-": 0.230,
  "=": 0.192
};