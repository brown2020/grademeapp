import { RubricType } from "@/lib/types/rubrics-types";

/**
 * How a rubric type stores its `criteria` object.
 * - `levels`:      { [criterion]: { [level]: text } }
 * - `described`:   { [criterion]: { description, [levelsKey]: { [level]: text } } }
 * - `checklist`:   { [item]: "Yes/No" }
 * - `multi-trait`: { [trait]: { description, subCriteria: { [id]: { description, levels } } } }
 * - `overall`:     { [level]: text }                       (holistic)
 * - `single-point`:{ Proficient: text } + rubric.feedback  (single-point)
 */
export type CriteriaShape =
  | "levels"
  | "described"
  | "checklist"
  | "multi-trait"
  | "overall"
  | "single-point";

export type LevelsKey = "levels" | "stages";

export interface RubricTypeConfig {
  type: RubricType;
  label: string;
  explanation: string;
  shape: CriteriaShape;
  /** Singular noun for one criterion row ("Criterion", "Standard", …). */
  itemLabel: string;
  /** Default level labels for a new criterion (or the overall scale). */
  defaultLevels: string[];
  /** Whether levels can be renamed, added and removed. */
  editableLevels: boolean;
  /** Level labels are numeric scores (primary-trait). */
  numericLevels?: boolean;
  levelsKey?: LevelsKey;
  levelsLabel?: string;
  namePlaceholder?: string;
  descriptionPlaceholder?: string;
  helpText?: string;
}

const STANDARD_LEVELS = ["Excellent", "Proficient", "Developing", "Beginning"];
const FOUR_POINT = ["Excellent", "Good", "Fair", "Poor"];

export const RUBRIC_TYPE_CONFIG: Record<RubricType, RubricTypeConfig> = {
  [RubricType.Analytical]: {
    type: RubricType.Analytical,
    label: "Analytical",
    explanation:
      "Breaks the evaluation into multiple criteria, each assessed separately, for detailed feedback on every aspect of the work.",
    shape: "levels",
    itemLabel: "Criterion",
    defaultLevels: STANDARD_LEVELS,
    editableLevels: false,
    namePlaceholder: "e.g. Organization",
    helpText: "Describe what each performance level looks like for this criterion.",
  },
  [RubricType.Holistic]: {
    type: RubricType.Holistic,
    label: "Holistic",
    explanation:
      "Gives a single, overall judgement of the work. Quick to apply, but offers less detail about specific aspects.",
    shape: "overall",
    itemLabel: "Level",
    defaultLevels: STANDARD_LEVELS,
    editableLevels: true,
    helpText: "Describe what the work looks like overall at each level.",
  },
  [RubricType.SinglePoint]: {
    type: RubricType.SinglePoint,
    label: "Single-point",
    explanation:
      "Defines what proficiency looks like without fixed levels, leaving room for open-ended feedback on strengths and areas to grow.",
    shape: "single-point",
    itemLabel: "Proficiency",
    defaultLevels: ["Proficient"],
    editableLevels: false,
  },
  [RubricType.Checklist]: {
    type: RubricType.Checklist,
    label: "Checklist",
    explanation:
      "A simple list of requirements, each marked as met or not met.",
    shape: "checklist",
    itemLabel: "Item",
    defaultLevels: [],
    editableLevels: false,
    namePlaceholder: "e.g. Has a clear introduction",
  },
  [RubricType.ContentSpecific]: {
    type: RubricType.ContentSpecific,
    label: "Content-specific",
    explanation:
      "Tailored to a particular subject or assignment, with context-relevant criteria.",
    shape: "described",
    itemLabel: "Criterion",
    defaultLevels: STANDARD_LEVELS,
    editableLevels: true,
    levelsKey: "levels",
    levelsLabel: "Performance levels",
    namePlaceholder: "e.g. Scientific accuracy",
    descriptionPlaceholder: "What this criterion evaluates",
  },
  [RubricType.Developmental]: {
    type: RubricType.Developmental,
    label: "Developmental",
    explanation:
      "Tracks growth over time through stages of skill development — useful across multiple drafts or a whole course.",
    shape: "described",
    itemLabel: "Criterion",
    defaultLevels: ["Emerging", "Developing", "Proficient", "Advanced"],
    editableLevels: true,
    levelsKey: "stages",
    levelsLabel: "Developmental stages",
    namePlaceholder: "e.g. Use of evidence",
    descriptionPlaceholder: "What growth in this area looks like",
  },
  [RubricType.PrimaryTrait]: {
    type: RubricType.PrimaryTrait,
    label: "Primary trait",
    explanation:
      "Focuses on one key characteristic of the work, such as thesis development, and scores it in depth.",
    shape: "described",
    itemLabel: "Trait",
    defaultLevels: ["4", "3", "2", "1"],
    editableLevels: false,
    numericLevels: true,
    levelsKey: "levels",
    levelsLabel: "Score levels",
    namePlaceholder: "e.g. Thesis development",
    descriptionPlaceholder: "The trait being assessed",
  },
  [RubricType.MultiTrait]: {
    type: RubricType.MultiTrait,
    label: "Multi-trait",
    explanation:
      "Assesses several distinct traits independently, each broken into sub-criteria with their own levels.",
    shape: "multi-trait",
    itemLabel: "Trait",
    defaultLevels: FOUR_POINT,
    editableLevels: false,
    namePlaceholder: "e.g. Voice",
    descriptionPlaceholder: "What this trait covers",
  },
  [RubricType.SkillFocused]: {
    type: RubricType.SkillFocused,
    label: "Skill-focused",
    explanation:
      "Assesses specific skills or competencies so you can track them across tasks.",
    shape: "levels",
    itemLabel: "Skill",
    defaultLevels: ["Exemplary", "Proficient", "Developing", "Emerging"],
    editableLevels: true,
    namePlaceholder: "e.g. Paraphrasing sources",
  },
  [RubricType.StandardsBased]: {
    type: RubricType.StandardsBased,
    label: "Standards-based",
    explanation:
      "Aligns each criterion with an established learning standard or objective.",
    shape: "described",
    itemLabel: "Standard",
    defaultLevels: [
      "Exceeds Standard (4)",
      "Meets Standard (3)",
      "Approaching Standard (2)",
      "Below Standard (1)",
    ],
    editableLevels: false,
    levelsKey: "levels",
    levelsLabel: "Performance levels",
    namePlaceholder: "e.g. Analyze theme development (RL.6.2)",
    descriptionPlaceholder: "The standard or learning objective",
  },
  [RubricType.TaskSpecific]: {
    type: RubricType.TaskSpecific,
    label: "Task-specific",
    explanation:
      "Written for one particular assignment, with criteria that reference that task directly.",
    shape: "described",
    itemLabel: "Criterion",
    defaultLevels: FOUR_POINT,
    editableLevels: false,
    levelsKey: "levels",
    levelsLabel: "Performance levels",
    namePlaceholder: "e.g. Thesis statement",
    descriptionPlaceholder: "What this criterion evaluates",
  },
};

export const RUBRIC_TYPES: RubricType[] = Object.values(RubricType);

export function getRubricTypeConfig(type: RubricType | string): RubricTypeConfig {
  return RUBRIC_TYPE_CONFIG[type as RubricType] ?? RUBRIC_TYPE_CONFIG[RubricType.Analytical];
}

export function rubricTypeLabel(type: RubricType | string): string {
  return RUBRIC_TYPE_CONFIG[type as RubricType]?.label ?? type;
}
