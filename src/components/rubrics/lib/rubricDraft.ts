import { getInitialRubricState } from "@/lib/types/initialRubricStates";
import type {
  GenericRubricCriteria,
  RubricState,
  RubricType,
  SinglePointRubric,
} from "@/lib/types/rubrics-types";
import {
  getRubricTypeConfig,
  type LevelsKey,
  type RubricTypeConfig,
} from "./rubricTypeConfig";

/**
 * Editable, list-based view of a rubric's `criteria` object. The builder edits
 * a draft; `applyDraft` serialises it back to the exact per-type document shape
 * (see CriteriaShape in rubricTypeConfig.ts). Anything the builder doesn't
 * understand is carried through untouched as a `raw` criterion or in `extras`.
 */

export interface LevelDraft {
  id: string;
  label: string;
  text: string;
}

export interface SubCriterionDraft {
  id: string;
  /** Key in the stored `subCriteria` record. */
  key: string;
  description: string;
  levels: LevelDraft[];
}

export type CriterionFormat = "levels" | "described" | "check" | "trait" | "raw";

export interface CriterionDraft {
  id: string;
  format: CriterionFormat;
  name: string;
  description: string;
  /** Whether a `description` key is written for this criterion. */
  hasDescription: boolean;
  levelsKey: LevelsKey;
  levels: LevelDraft[];
  subCriteria: SubCriterionDraft[];
  /** Checklist value (normally "Yes/No"). */
  value: string;
  /** Original value for criteria the builder can't edit. */
  raw?: unknown;
}

export interface RubricDraft {
  type: RubricType;
  criteria: CriterionDraft[];
  /** Level descriptions for holistic, or the single "Proficient" entry for single-point. */
  overall: LevelDraft[];
  feedback: { strengths: string; improvements: string } | null;
  /** Unrecognised top-level criteria keys for overall/single-point rubrics. */
  extras: Record<string, unknown>;
}

let seq = 0;
const nextId = (prefix: string) => `${prefix}-${++seq}`;

export const CHECKLIST_VALUE = "Yes/No";

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return isPlainObject(value) && Object.values(value).every((v) => typeof v === "string");
}

function levelsFromRecord(record: Record<string, string>): LevelDraft[] {
  return Object.entries(record).map(([label, text]) => ({ id: nextId("lvl"), label, text }));
}

function recordFromLevels(levels: LevelDraft[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const level of levels) out[level.label.trim()] = level.text;
  return out;
}

export function createLevel(label = "", text = ""): LevelDraft {
  return { id: nextId("lvl"), label, text };
}

export function createSubCriterion(levelLabels: string[]): SubCriterionDraft {
  return {
    id: nextId("sub"),
    key: `sub-${Date.now().toString(36)}-${seq}`,
    description: "",
    levels: levelLabels.map((label) => createLevel(label)),
  };
}

function baseCriterion(name: string): CriterionDraft {
  return {
    id: nextId("crit"),
    format: "levels",
    name,
    description: "",
    hasDescription: false,
    levelsKey: "levels",
    levels: [],
    subCriteria: [],
    value: CHECKLIST_VALUE,
  };
}

/** A blank criterion in the canonical format for the rubric type. */
export function createCriterion(config: RubricTypeConfig, name = ""): CriterionDraft {
  const c = baseCriterion(name);
  switch (config.shape) {
    case "checklist":
      return { ...c, format: "check" };
    case "described":
      return {
        ...c,
        format: "described",
        hasDescription: true,
        levelsKey: config.levelsKey ?? "levels",
        levels: config.defaultLevels.map((label) => createLevel(label)),
      };
    case "multi-trait":
      return {
        ...c,
        format: "trait",
        hasDescription: true,
        subCriteria: [createSubCriterion(config.defaultLevels)],
      };
    default:
      return { ...c, levels: config.defaultLevels.map((label) => createLevel(label)) };
  }
}

function parseTrait(value: PlainObject): Omit<CriterionDraft, "id" | "name"> | null {
  const { description, subCriteria, ...rest } = value;
  if (Object.keys(rest).length > 0) return null;
  if (description !== undefined && typeof description !== "string") return null;
  if (!isPlainObject(subCriteria)) return null;
  const subs: SubCriterionDraft[] = [];
  for (const [key, sub] of Object.entries(subCriteria)) {
    if (!isPlainObject(sub)) return null;
    const { description: subDescription, levels, ...subRest } = sub;
    if (Object.keys(subRest).length > 0) return null;
    if (typeof subDescription !== "string" || !isStringRecord(levels)) return null;
    subs.push({ id: nextId("sub"), key, description: subDescription, levels: levelsFromRecord(levels) });
  }
  return {
    ...baseCriterion(""),
    format: "trait",
    description: description ?? "",
    hasDescription: description !== undefined,
    subCriteria: subs,
  };
}

function parseDescribed(value: PlainObject): Omit<CriterionDraft, "id" | "name"> | null {
  const { description, ...rest } = value;
  const keys = Object.keys(rest);
  if (keys.length !== 1) return null;
  const levelsKey = keys[0];
  if (levelsKey !== "levels" && levelsKey !== "stages") return null;
  if (description !== undefined && typeof description !== "string") return null;
  const levels = rest[levelsKey];
  if (!isStringRecord(levels)) return null;
  return {
    ...baseCriterion(""),
    format: "described",
    description: description ?? "",
    hasDescription: description !== undefined,
    levelsKey,
    levels: levelsFromRecord(levels),
  };
}

function parseCriterion(name: string, value: unknown, config: RubricTypeConfig): CriterionDraft {
  const base = baseCriterion(name);
  if (typeof value === "string" && config.shape === "checklist") {
    return { ...base, format: "check", value };
  }
  if (isStringRecord(value)) {
    const { description, ...levels } = value;
    return {
      ...base,
      format: "levels",
      description: description ?? "",
      hasDescription: description !== undefined,
      levels: levelsFromRecord(levels),
    };
  }
  if (isPlainObject(value)) {
    const parsed = "subCriteria" in value ? parseTrait(value) : parseDescribed(value);
    if (parsed) return { ...parsed, id: base.id, name };
  }
  return { ...base, format: "raw", raw: value };
}

/** Build an editable draft from a stored rubric. */
export function draftFromRubric(rubric: RubricState): RubricDraft {
  const config = getRubricTypeConfig(rubric.type);
  const criteria: GenericRubricCriteria = isPlainObject(rubric.criteria) ? rubric.criteria : {};
  const draft: RubricDraft = {
    type: rubric.type,
    criteria: [],
    overall: [],
    feedback: null,
    extras: {},
  };

  if (config.shape === "overall" || config.shape === "single-point") {
    for (const [key, value] of Object.entries(criteria)) {
      const isEditable =
        typeof value === "string" && (config.shape === "overall" || key === "Proficient");
      if (isEditable) draft.overall.push(createLevel(key, value));
      else draft.extras[key] = value;
    }
    if (config.shape === "single-point") {
      if (!draft.overall.some((l) => l.label === "Proficient")) {
        draft.overall.unshift(createLevel("Proficient"));
      }
      const feedback = (rubric as SinglePointRubric).feedback;
      if (feedback) {
        draft.feedback = {
          strengths: feedback.Strengths ?? "",
          improvements: feedback["Areas for Improvement"] ?? "",
        };
      }
    }
    return draft;
  }

  draft.criteria = Object.entries(criteria).map(([name, value]) =>
    parseCriterion(name, value, config)
  );
  return draft;
}

/** A draft for a brand-new rubric of `type`, seeded with one blank criterion. */
export function createDraft(type: RubricType): RubricDraft {
  const draft = draftFromRubric(getInitialRubricState(type));
  const config = getRubricTypeConfig(type);
  const usesCriteriaList = config.shape !== "overall" && config.shape !== "single-point";
  if (usesCriteriaList && draft.criteria.length === 0) {
    draft.criteria = [createCriterion(config)];
  }
  return draft;
}

function serializeCriterion(c: CriterionDraft): unknown {
  switch (c.format) {
    case "raw":
      return c.raw;
    case "check":
      return c.value || CHECKLIST_VALUE;
    case "levels": {
      const levels = recordFromLevels(c.levels);
      return c.hasDescription ? { description: c.description, ...levels } : levels;
    }
    case "described": {
      const levels = recordFromLevels(c.levels);
      return c.hasDescription
        ? { description: c.description, [c.levelsKey]: levels }
        : { [c.levelsKey]: levels };
    }
    case "trait": {
      const subCriteria: Record<string, { description: string; levels: Record<string, string> }> = {};
      for (const sub of c.subCriteria) {
        subCriteria[sub.key] = { description: sub.description, levels: recordFromLevels(sub.levels) };
      }
      return c.hasDescription ? { description: c.description, subCriteria } : { subCriteria };
    }
  }
}

/** Serialise a draft back to the stored `criteria` (and single-point `feedback`). */
export function criteriaFromDraft(draft: RubricDraft): {
  criteria: GenericRubricCriteria;
  feedback?: SinglePointRubric["feedback"];
} {
  const config = getRubricTypeConfig(draft.type);
  const criteria: Record<string, unknown> = {};

  if (config.shape === "overall" || config.shape === "single-point") {
    for (const level of draft.overall) criteria[level.label.trim()] = level.text;
    Object.assign(criteria, draft.extras);
  } else {
    for (const c of draft.criteria) criteria[c.name.trim()] = serializeCriterion(c);
  }

  const result: { criteria: GenericRubricCriteria; feedback?: SinglePointRubric["feedback"] } = {
    criteria: criteria as GenericRubricCriteria,
  };
  if (config.shape === "single-point" && draft.feedback) {
    result.feedback = {
      Strengths: draft.feedback.strengths,
      "Areas for Improvement": draft.feedback.improvements,
    };
  }
  return result;
}

/** Merge edited name/description/criteria onto the base rubric document. */
export function applyDraft(
  base: RubricState,
  draft: RubricDraft,
  fields: { name: string; description: string }
): RubricState {
  const { criteria, feedback } = criteriaFromDraft(draft);
  return {
    ...base,
    name: fields.name.trim(),
    description: fields.description.trim(),
    criteria,
    ...(feedback ? { feedback } : {}),
  } as RubricState;
}

function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const v of values) {
    const key = v.trim().toLowerCase();
    if (seen.has(key)) dupes.add(v.trim());
    seen.add(key);
  }
  return [...dupes];
}

function validateLevels(levels: LevelDraft[], owner: string): string[] {
  const errors: string[] = [];
  if (levels.length === 0) errors.push(`${owner} needs at least one level.`);
  if (levels.some((l) => !l.label.trim())) errors.push(`${owner} has a level without a name.`);
  for (const d of duplicates(levels.map((l) => l.label))) {
    errors.push(`${owner} has more than one level named "${d}".`);
  }
  return errors;
}

/** Returns human-readable problems that would prevent saving. Empty = valid. */
export function validateDraft(draft: RubricDraft): string[] {
  const config = getRubricTypeConfig(draft.type);
  const errors: string[] = [];

  if (config.shape === "overall") {
    errors.push(...validateLevels(draft.overall, "The rubric"));
    if (!draft.overall.some((l) => l.text.trim())) {
      errors.push("Describe at least one level.");
    }
    return errors;
  }
  if (config.shape === "single-point") {
    if (!draft.overall.find((l) => l.label === "Proficient")?.text.trim()) {
      errors.push("Describe what proficient work looks like.");
    }
    return errors;
  }

  const noun = config.itemLabel.toLowerCase();
  if (draft.criteria.length === 0) errors.push(`Add at least one ${noun}.`);
  if (draft.criteria.some((c) => !c.name.trim())) {
    errors.push(`Every ${noun} needs a name.`);
  }
  for (const d of duplicates(draft.criteria.map((c) => c.name).filter((n) => n.trim()))) {
    errors.push(`Two ${noun}s are named "${d}". Names must be unique.`);
  }
  for (const c of draft.criteria) {
    const owner = c.name.trim() ? `"${c.name.trim()}"` : `A ${noun}`;
    if (c.format === "levels" || c.format === "described") {
      errors.push(...validateLevels(c.levels, owner));
    }
    if (c.format === "trait") {
      if (c.subCriteria.length === 0) errors.push(`${owner} needs at least one sub-criterion.`);
      if (c.subCriteria.some((s) => !s.description.trim())) {
        errors.push(`${owner} has a sub-criterion without a description.`);
      }
      c.subCriteria.forEach((s, i) => errors.push(...validateLevels(s.levels, `${owner} sub-criterion ${i + 1}`)));
    }
  }
  return errors;
}

export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) {
    return items;
  }
  const next = items.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
