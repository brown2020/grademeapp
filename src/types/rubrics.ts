// Criteria for analytical rubrics (specific categories)
export interface AnalyticalRubricCriteria {
    [criterion: string]: {
        Excellent: string;
        Proficient: string;
        Developing: string;
        Beginning: string;
    };
}

// Overall criteria for holistic rubrics (holistic evaluation)
export interface HolisticRubricCriteria {
    Excellent: string;
    Proficient: string;
    Developing: string;
    Beginning: string;
}

// Base interface for all rubric types
export interface BaseRubric {
    name: string;
    description?: string;
    type: RubricType; // Specifies the type of rubric
}

// Analytical rubric: includes multiple specific categories for evaluation
export interface AnalyticalRubric extends BaseRubric {
    type: RubricType.Analytical;
    criteria: AnalyticalRubricCriteria;
}

// Holistic rubric: provides a general overall evaluation
export interface HolisticRubric extends BaseRubric {
    type: RubricType.Holistic;
    criteria: HolisticRubricCriteria;
}

// General interface for other types of rubrics if needed in the future
export interface OtherRubricType extends BaseRubric {
    type: RubricType.ContentSpecific | RubricType.SkillFocused | RubricType.Developmental;
    criteria: AnalyticalRubricCriteria | HolisticRubricCriteria; // Adapt criteria as needed
}

// Enum for type safety across rubric types
export enum RubricType {
    Analytical = 'analytical',
    Holistic = 'holistic',
    ContentSpecific = 'content-specific',
    SkillFocused = 'skill-focused',
    Developmental = 'developmental'
}

// Union type for all possible rubric state types
export type RubricState = AnalyticalRubric | HolisticRubric | OtherRubricType;

// Maps prose type to corresponding rubric details, accommodating multiple rubric types
export interface RubricProseType {
    [proseType: string]: {
        holistic?: HolisticRubric;
        analytical?: AnalyticalRubric;
        contentSpecific?: OtherRubricType;
        skillFocused?: OtherRubricType;
        developmental?: OtherRubricType;
    };
}


// Maps text types (like "narrative") to their corresponding prose types
export interface RubricTextType {
    [textType: string]: RubricProseType;
}

// Generalizing `identityLevelRubrics` to allow different identities
interface IdentityLevelRubrics {
    [identityLevel: string]: RubricTextType; // e.g., "6th_grade", "level1", "beginner"
}

// Abstracting `Rubrics` to associate identity types with their levels and corresponding rubrics
export interface Rubrics {
    [identityType: string]: IdentityLevelRubrics; // e.g., "student", "teacher", "professional"
}
