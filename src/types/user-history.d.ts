type Timestamp = Timestamp;

interface UserInput {
    assigner: string;
    audience: string;
    customRubric: string;
    identity: string;
    identityLevel: string;
    prose: string;
    rubric: string;
    text: string;
    textType: string;
    title: string;
    topic: string;
    wordLimit: string;
    wordLimitType: string;
}

export interface UserHistoryType {
    id: string;
    fileUrl: string;
    grade: string;
    response: string;
    userInput: UserInput;
    timestamp: Timestamp;
}
