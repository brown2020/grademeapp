import { Rubric } from "@/constants/rubrics_new";

export type GradingData = {
    title: string;
    text: string; // The text to be analyzed
    assigner: string; // Instructor or person assigning the task
    textType: string; // Type of text (essay, report, etc.)
    topic: string; // Topic of the assignment
    prose: string;
    audience: string; // The intended audience of the assignment
    wordLimitType: "less than" | "more than" | "between"; // Word limit condition (less or more)
    wordLimit: string; // Word limit value
    customRubric: string; // Optional custom rubric
    rubric: Rubric; // Specific rubric
};