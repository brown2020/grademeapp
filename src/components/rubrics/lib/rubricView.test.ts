import { describe, expect, it } from "vitest";
import { RubricType } from "@/lib/types/rubrics-types";
import rawRubrics from "@/lib/constants/rubrics.json";
import { buildRubricView, countCriteria } from "./rubricView";

describe("buildRubricView", () => {
  it("renders holistic rubrics as a level list", () => {
    const view = buildRubricView({ type: RubricType.Holistic, criteria: { Excellent: "e", Poor: "p" } });
    expect(view).toEqual({ kind: "levels", levels: [{ label: "Excellent", text: "e" }, { label: "Poor", text: "p" }] });
  });

  it("renders checklists as items", () => {
    expect(buildRubricView({ type: RubricType.Checklist, criteria: { Intro: "Yes/No" } }).kind).toBe("checklist");
  });

  it("renders single-point with non-empty feedback prompts", () => {
    const view = buildRubricView({
      type: RubricType.SinglePoint,
      criteria: { Proficient: "p" },
      feedback: { Strengths: "s", "Areas for Improvement": "" },
    });
    expect(view).toEqual({ kind: "single-point", proficient: "p", feedback: [{ label: "Strengths", text: "s" }] });
  });

  it("renders analytical rubrics with a shared scale as a table", () => {
    const view = buildRubricView({
      type: RubricType.Analytical,
      criteria: { A: { High: "h", Low: "l" }, B: { High: "h2", Low: "l2" } },
    });
    expect(view).toMatchObject({ kind: "matrix", columns: ["High", "Low"] });
  });

  it("uses stacked rows when scales differ, and reads described/stages criteria", () => {
    const view = buildRubricView({
      type: RubricType.Developmental,
      criteria: { A: { description: "d", stages: { One: "1" } }, B: { X: "x", Y: "y" } },
    });
    expect(view).toEqual({
      kind: "matrix",
      columns: null,
      rows: [
        { name: "A", description: "d", levels: [{ label: "One", text: "1" }] },
        { name: "B", description: undefined, levels: [{ label: "X", text: "x" }, { label: "Y", text: "y" }] },
      ],
    });
  });

  it("renders multi-trait sub-criteria", () => {
    const view = buildRubricView({
      type: RubricType.MultiTrait,
      criteria: { Voice: { description: "d", subCriteria: { a: { description: "s", levels: { Good: "g" } } } } },
    });
    expect(view).toEqual({
      kind: "multi-trait",
      traits: [{ name: "Voice", description: "d", subCriteria: [{ description: "s", levels: [{ label: "Good", text: "g" }] }] }],
    });
  });

  it("falls back to a tree for irregular nested criteria", () => {
    const view = buildRubricView({
      type: RubricType.Analytical,
      criteria: { thesis_statement: { "0": { evidence: "x" }, points: 1 } },
    });
    expect(view.kind).toBe("tree");
    if (view.kind === "tree") expect(view.nodes[0].label).toBe("Thesis statement");
  });

  it("handles empty criteria", () => {
    expect(buildRubricView({ type: RubricType.Analytical, criteria: {} })).toEqual({ kind: "empty" });
    expect(countCriteria({ criteria: { a: "x", b: "y" } })).toBe(2);
  });

  it("produces a view for every bundled default rubric", () => {
    for (const rubric of rawRubrics as { type: RubricType; criteria: Record<string, unknown> }[]) {
      const view = buildRubricView(rubric as Parameters<typeof buildRubricView>[0]);
      expect(view.kind).not.toBe("empty");
    }
  });
});
