// Helper function to extract a grade from the response
export function extractGrade (response: string) {
    const gradeMatch = response.match(/(?:Grade|letter grade|grade):?\s*([A-F])/i);
    return gradeMatch ? gradeMatch[1] : "N/A";
};

// Helper function to get the first sentence from the response
export function getExcerpt (text: string) {
    const firstSentence = text.slice(0, 100); // Get first 100 characters
    return firstSentence ? firstSentence.trim() + "..." : "";
};