// Helper function to extract a grade from the response
export function extractGrade(response: string) {
    const gradeMatch = response.match(/Grade:\s*(\d{1,3}%)/i);
    return gradeMatch ? gradeMatch[1] : "N/A";
}