import { RubricType, type RubricState, type SinglePointRubric } from "@/lib/types/rubrics-types";

/** Display-ready, type-agnostic view of a rubric's criteria. */

export interface LevelEntry {
  label: string;
  text: string;
}

export interface MatrixRow {
  name: string;
  description?: string;
  levels: LevelEntry[];
}

export interface TraitView {
  name: string;
  description?: string;
  subCriteria: { description: string; levels: LevelEntry[] }[];
}

export type TreeNode = { label: string; text?: string; children?: TreeNode[] };

export type RubricView =
  | { kind: "levels"; levels: LevelEntry[] }
  | { kind: "single-point"; proficient: string; feedback: LevelEntry[] }
  | { kind: "checklist"; items: LevelEntry[] }
  | { kind: "matrix"; rows: MatrixRow[]; columns: string[] | null }
  | { kind: "multi-trait"; traits: TraitView[] }
  | { kind: "tree"; nodes: TreeNode[] }
  | { kind: "empty" };

type PlainObject = Record<string, unknown>;

const isPlainObject = (v: unknown): v is PlainObject =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const isScalar = (v: unknown): v is string | number => typeof v === "string" || typeof v === "number";

function toLevels(record: PlainObject): LevelEntry[] | null {
  const out: LevelEntry[] = [];
  for (const [label, text] of Object.entries(record)) {
    if (!isScalar(text)) return null;
    out.push({ label, text: String(text) });
  }
  return out;
}

export function humanizeKey(key: string): string {
  if (!/[_]/.test(key) && /[A-Z\s]/.test(key)) return key;
  const spaced = key.replace(/_/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function toTree(value: unknown, label: string): TreeNode {
  if (isScalar(value)) return { label, text: String(value) };
  if (Array.isArray(value)) {
    return { label, children: value.map((v, i) => toTree(v, String(i + 1))) };
  }
  if (isPlainObject(value)) {
    return {
      label,
      children: Object.entries(value).map(([k, v]) => toTree(v, humanizeKey(k))),
    };
  }
  return { label };
}

function toMatrixRow(name: string, value: unknown): MatrixRow | null {
  if (!isPlainObject(value)) return null;
  const { description, levels, stages, ...rest } = value;
  if (description !== undefined && typeof description !== "string") return null;
  const nested = levels ?? stages;

  if (nested !== undefined) {
    if (Object.keys(rest).length > 0 || (levels !== undefined && stages !== undefined)) return null;
    if (!isPlainObject(nested)) return null;
    const entries = toLevels(nested);
    return entries ? { name, description, levels: entries } : null;
  }
  const entries = toLevels(rest);
  return entries ? { name, description, levels: entries } : null;
}

function sameColumns(rows: MatrixRow[]): string[] | null {
  if (rows.length === 0) return null;
  const first = rows[0].levels.map((l) => l.label);
  if (first.length < 2) return null;
  const all = rows.every(
    (r) => r.levels.length === first.length && r.levels.every((l, i) => l.label === first[i])
  );
  return all ? first : null;
}

function toTraits(criteria: PlainObject): TraitView[] | null {
  const traits: TraitView[] = [];
  for (const [name, value] of Object.entries(criteria)) {
    if (!isPlainObject(value) || !isPlainObject(value.subCriteria)) return null;
    const subs: TraitView["subCriteria"] = [];
    for (const sub of Object.values(value.subCriteria)) {
      if (!isPlainObject(sub) || !isPlainObject(sub.levels)) return null;
      const levels = toLevels(sub.levels);
      if (!levels) return null;
      subs.push({
        description: typeof sub.description === "string" ? sub.description : "",
        levels,
      });
    }
    traits.push({
      name,
      description: typeof value.description === "string" ? value.description : undefined,
      subCriteria: subs,
    });
  }
  return traits;
}

/** Normalises any stored rubric into one of a few renderable layouts. */
export function buildRubricView(rubric: Pick<RubricState, "type" | "criteria"> & { feedback?: SinglePointRubric["feedback"] }): RubricView {
  const criteria = isPlainObject(rubric.criteria) ? rubric.criteria : {};
  const entries = Object.entries(criteria);
  if (entries.length === 0 && !rubric.feedback) return { kind: "empty" };

  const allScalar = entries.every(([, v]) => isScalar(v));

  if (rubric.type === RubricType.SinglePoint && allScalar) {
    const feedback = rubric.feedback
      ? [
          { label: "Strengths", text: rubric.feedback.Strengths ?? "" },
          { label: "Areas for Improvement", text: rubric.feedback["Areas for Improvement"] ?? "" },
        ].filter((f) => f.text.trim())
      : [];
    const proficient = criteria.Proficient;
    return {
      kind: "single-point",
      proficient: isScalar(proficient) ? String(proficient) : "",
      feedback,
    };
  }

  if (allScalar) {
    const items = entries.map(([label, text]) => ({ label, text: String(text) }));
    return rubric.type === RubricType.Checklist ? { kind: "checklist", items } : { kind: "levels", levels: items };
  }

  if (rubric.type === RubricType.MultiTrait) {
    const traits = toTraits(criteria);
    if (traits) return { kind: "multi-trait", traits };
  }

  const rows: MatrixRow[] = [];
  for (const [name, value] of entries) {
    const row = toMatrixRow(name, value);
    if (!row) {
      return { kind: "tree", nodes: entries.map(([k, v]) => toTree(v, humanizeKey(k))) };
    }
    rows.push(row);
  }
  return { kind: "matrix", rows, columns: sameColumns(rows) };
}

/** Number of top-level criteria, used for card summaries. */
export function countCriteria(rubric: Pick<RubricState, "criteria">): number {
  return isPlainObject(rubric.criteria) ? Object.keys(rubric.criteria).length : 0;
}
