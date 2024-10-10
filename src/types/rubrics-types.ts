// Base interface for all rubric types
export interface BaseRubric {
    id: string;
    name: string;
    description?: string;
    type: RubricType; // Specifies the type of rubric
    tags?: string[];
    identity?: string;
    identityLevel?: string;
    textType?: string;
    proseType?: string;
    criteria: GenericRubricCriteria; // Use a more flexible type for criteria
}

// A more flexible approach to represent nested criteria for rubrics with varying depth.
export interface GenericRubricCriteria {
    [criterion: string]: string | number | NestedRubricCriteria | (string | number)[] | Record<string, string | number | object>;
}

export interface AnalyticalRubric extends BaseRubric {
    type: RubricType.Analytical;
}

export interface HolisticRubric extends BaseRubric {
    type: RubricType.Holistic;
}

export interface HolisticAnalyticalRubric extends BaseRubric {
    type: RubricType.HolisticAnalytical;
    criteria: GenericRubricCriteria;
}

// Nested structure to support varying levels of depth in criteria
export interface NestedRubricCriteria {
    [sublevel: string]: string | NestedRubricCriteria;
}

// Analytical rubric: includes multiple specific categories for evaluation
export interface AnalyticalRubric extends BaseRubric {
    type: RubricType.Analytical;
    criteria: GenericRubricCriteria;
}

// Holistic rubric: provides a general overall evaluation
export interface HolisticRubric extends BaseRubric {
    type: RubricType.Holistic;
    criteria: GenericRubricCriteria;
}

export interface SinglePointRubric extends BaseRubric {
    type: RubricType.SinglePoint;
    criteria: GenericRubricCriteria;
    feedback?: {
        Strengths: string;
        "Areas for Improvement": string;
    };
}

export interface ChecklistRubric extends BaseRubric {
    type: RubricType.Checklist;
    criteria: {
        [requirement: string]: string | "Yes/No";
    };
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
    criteria: GenericRubricCriteria;
}

// Enum for type safety across rubric types
export enum RubricType {
    Analytical = 'analytical',
    Holistic = 'holistic',
    HolisticAnalytical = 'holistic_analytical',
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
    | HolisticAnalyticalRubric
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
 * Unified Rubrics:
 * - Combines both default rubrics and nested rubrics under a single type.
 * - Enables handling of both scenarios in a unified way.
 */
export interface Rubrics {
    default: DefaultRubrics;
}

/**
 * Keys used to access different default rubric types.
 */
export type DefaultRubricKeys =
    | "holistic"
    | "analytical"
    | "holistic_analytical"
    | "developmental"
    | "primary_trait"
    | "multitrait"
    | "task_specific"
    | "standards_based"
    | "single_point"
    | "checklist";
