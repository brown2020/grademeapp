import { Timestamp } from 'firebase/firestore';

// Base interface for all rubric types
export interface BaseRubric<TCriteria = GenericRubricCriteria> {
  id: string;
  name: string;
  description?: string;
  type: RubricType;
  tags?: string[];
  identity?: string;
  identityLevel?: string;
  textType?: string;
  proseType?: string;
  criteria: TCriteria;
  timestamp?: Timestamp;
  isCustom?: boolean;
}

// A more flexible approach to represent nested criteria for rubrics with varying depth.
export interface GenericRubricCriteria {
  [criterion: string]:
  | string
  | number
  | NestedRubricCriteria
  | (string | number)[]
  | Record<string, string | number | object>
  | MultiTraitCriterion;
}

// Nested structure to support varying levels of depth in criteria
export interface NestedRubricCriteria {
  [sublevel: string]: string | NestedRubricCriteria;
}

// Analytical rubric: includes multiple specific categories for evaluation
export interface AnalyticalRubric extends BaseRubric<GenericRubricCriteria> {
  type: RubricType.Analytical;
}

// Holistic rubric: provides a general overall evaluation
export interface HolisticRubric extends BaseRubric<GenericRubricCriteria> {
  type: RubricType.Holistic;
}

export interface SinglePointRubric extends BaseRubric<GenericRubricCriteria> {
  type: RubricType.SinglePoint;
  feedback?: {
    Strengths: string;
    "Areas for Improvement": string;
  };
}

export interface ChecklistRubric extends BaseRubric<GenericRubricCriteria> {
  type: RubricType.Checklist;
}

// Define interfaces for MultiTraitRubric
export interface MultiTraitRubric extends BaseRubric<Record<string, MultiTraitCriterion>> {
  type: RubricType.MultiTrait;
}

export interface MultiTraitCriterion {
  [key: string]: string | number | object | undefined;
  name?: string;
  description?: string;
  subCriteria: Record<string, MultiTraitSubCriterion>;
}

export interface MultiTraitSubCriterion {
  [key: string]: string | number | object | undefined;
  name?: string;
  description?: string;
  levels: Record<string, string>; // Performance levels and their descriptions
}

// New interfaces for the missing rubric types
export interface ContentSpecificRubric extends BaseRubric<GenericRubricCriteria> {
  type: RubricType.ContentSpecific;
}

export interface SkillFocusedRubric extends BaseRubric<GenericRubricCriteria> {
  type: RubricType.SkillFocused;
}

export interface DevelopmentalRubric extends BaseRubric<GenericRubricCriteria> {
  type: RubricType.Developmental;
}

export interface PrimaryTraitRubric extends BaseRubric<GenericRubricCriteria> {
  type: RubricType.PrimaryTrait;
}

export interface TaskSpecificRubric extends BaseRubric<GenericRubricCriteria> {
  type: RubricType.TaskSpecific;
}

export interface StandardsBasedRubric extends BaseRubric<GenericRubricCriteria> {
  type: RubricType.StandardsBased;
}

// Enum for type safety across rubric types
export enum RubricType {
  Analytical = 'analytical',
  Holistic = 'holistic',
  ContentSpecific = 'content-specific',
  SkillFocused = 'skill-focused',
  Developmental = 'developmental',
  PrimaryTrait = 'primary-trait',
  MultiTrait = 'multi-trait',
  TaskSpecific = 'task-specific',
  StandardsBased = 'standards-based',
  SinglePoint = 'single-point',
  Checklist = 'checklist'
}

// Union type for all possible rubric state types
export type RubricState =
  | HolisticRubric
  | AnalyticalRubric
  | SinglePointRubric
  | ChecklistRubric
  | MultiTraitRubric
  | ContentSpecificRubric
  | SkillFocusedRubric
  | DevelopmentalRubric
  | PrimaryTraitRubric
  | TaskSpecificRubric
  | StandardsBasedRubric;

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
  | "content-specific"
  | "developmental"
  | "primary-trait"
  | "multi-trait"
  | "task-specific"
  | "standards-based"
  | "single-point"
  | "checklist";

