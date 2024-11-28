type Timestamp = Timestamp;

interface Submission {
    text: string;
    response: string;
    grade: string;
    timestamp: Timestamp;
}

interface UserInput {
    assigner: string;
    audience: string;
    customRubric: string;
    identity: string;
    identityLevel: string;
    prose: string;
    rubric: string;
    textType: string;
    title: string;
    topic: string;
    wordLimit: string;
    wordLimitType: string;
}

export interface UserHistoryType {
    id: string;
    userInput: UserInput;
    submissions: Submission[];
    fileUrl: string;
    timestamp: Timestamp;
}
