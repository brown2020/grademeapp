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

// Criteria for skill-focused rubrics
export interface SkillFocusedRubricCriteria {
    [level: string]: string; // E.g., 'Exceeds Standards', 'Meets Standards', etc.
}

// Criteria for content-specific rubrics like primary trait, multitrait, task-specific
export interface ContentSpecificRubricCriteria {
    [trait: string]: {
        [level: string]: string; // E.g., 'Excellent', 'Proficient', etc.
    };
}

// Criteria for a single-point rubric
export interface SinglePointRubricCriteria {
    Proficient: string;
}

export interface SinglePointRubric extends BaseRubric {
    type: RubricType.SinglePoint;
    criteria: SinglePointRubricCriteria;
    feedback?: {
        Strengths: string;
        "Areas for Improvement": string;
    };
}

export interface ChecklistRubricCriteria {
    [requirement: string]: "Yes/No" | string;
}

export interface ChecklistRubric extends BaseRubric {
    type: RubricType.Checklist;
    criteria: ChecklistRubricCriteria;
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
    type:
    | RubricType.ContentSpecific
    | RubricType.SkillFocused
    | RubricType.Developmental
    | RubricType.PrimaryTrait
    | RubricType.MultiTrait
    | RubricType.TaskSpecific
    | RubricType.StandardsBased
    | RubricType.SinglePoint
    | RubricType.Checklist;
    criteria:
    | AnalyticalRubricCriteria
    | HolisticRubricCriteria
    | SkillFocusedRubricCriteria
    | ContentSpecificRubricCriteria
    | SinglePointRubricCriteria
    | ChecklistRubricCriteria;
}

// Enum for type safety across rubric types
export enum RubricType {
    Analytical = 'analytical',
    Holistic = 'holistic',
    ContentSpecific = 'content-specific',
    SkillFocused = 'skill-focused',
    Developmental = 'developmental',
    PrimaryTrait = 'primary_trait',
    MultiTrait = 'multitrait',
    TaskSpecific = 'task_specific',
    StandardsBased = 'standards_based',
    SinglePoint = 'single_point',
    Checklist = 'checklist'
}

// Union type for all possible rubric state types
export type RubricState =
    | AnalyticalRubric
    | HolisticRubric
    | SinglePointRubric
    | ChecklistRubric
    | OtherRubricType;

/**
 * Default Rubric Structure:
 * - This is a simplified structure to handle default rubrics without deep nesting.
 */
export type DefaultRubrics = {
    [key in DefaultRubricKeys]: RubricState; // Keys like "holistic", "analytical", etc.
};

/**
 * Flexible Nested Rubrics:
 * - This structure allows for any level of nesting, starting with identity.
 * - It is more flexible and allows deeper layers like identity -> grade -> text type -> rubric type.
 */
export interface NestedRubrics {
    [key: string]: NestedRubrics | RubricState; // Key is identity, grade, etc., or a direct rubric state.
}

/**
 * Unified Rubrics:
 * - Combines both default rubrics and nested rubrics under a single type.
 * - Enables handling of both scenarios in a unified way.
 */
export interface Rubrics {
    default: DefaultRubrics;
    nested?: NestedRubrics;
}

/**
 * Keys used to access different default rubric types.
 */
export type DefaultRubricKeys =
    | "holistic"
    | "analytical"
    | "developmental"
    | "primary_trait"
    | "multitrait"
    | "task_specific"
    | "standards_based"
    | "single_point"
    | "checklist";
