import { describe, expect, it } from "vitest";
import { RubricType, type RubricState } from "@/lib/types/rubrics-types";
import { getInitialRubricState } from "@/lib/types/initialRubricStates";
import {
  applyDraft,
  createCriterion,
  createDraft,
  criteriaFromDraft,
  draftFromRubric,
  moveItem,
  validateDraft,
  type RubricDraft,
} from "./rubricDraft";
import { RUBRIC_TYPES, RUBRIC_TYPE_CONFIG } from "./rubricTypeConfig";

function rubric(type: RubricType, criteria: Record<string, unknown>, extra: Partial<RubricState> = {}): RubricState {
  return { id: "r1", name: "R", description: "D", type, criteria, ...extra } as RubricState;
}

function fillDraft(draft: RubricDraft, name: string, fill: string): RubricDraft {
  return {
    ...draft,
    criteria: draft.criteria.map((c) => ({
      ...c,
      name,
      description: c.hasDescription ? `${fill} desc` : c.description,
      levels: c.levels.map((l) => ({ ...l, text: `${fill} ${l.label}` })),
      subCriteria: c.subCriteria.map((s) => ({
        ...s,
        description: `${fill} sub`,
        levels: s.levels.map((l) => ({ ...l, text: `${fill} ${l.label}` })),
      })),
    })),
  };
}

describe("serialised shapes per type (must match the legacy per-type builders)", () => {
  it("analytical: { name: { Excellent, Proficient, Developing, Beginning } }", () => {
    const { criteria } = criteriaFromDraft(fillDraft(createDraft(RubricType.Analytical), "Organization", "x"));
    expect(criteria).toEqual({
      Organization: { Excellent: "x Excellent", Proficient: "x Proficient", Developing: "x Developing", Beginning: "x Beginning" },
    });
  });

  it("skill-focused: { name: { Exemplary, Proficient, Developing, Emerging } }", () => {
    const { criteria } = criteriaFromDraft(fillDraft(createDraft(RubricType.SkillFocused), "Citing", "x"));
    expect(Object.keys(criteria.Citing as object)).toEqual(["Exemplary", "Proficient", "Developing", "Emerging"]);
  });

  it("content-specific / task-specific / standards-based: { name: { description, levels } }", () => {
    const expected: Record<string, string[]> = {
      [RubricType.ContentSpecific]: ["Excellent", "Proficient", "Developing", "Beginning"],
      [RubricType.TaskSpecific]: ["Excellent", "Good", "Fair", "Poor"],
      [RubricType.StandardsBased]: [
        "Exceeds Standard (4)",
        "Meets Standard (3)",
        "Approaching Standard (2)",
        "Below Standard (1)",
      ],
    };
    for (const [type, levels] of Object.entries(expected)) {
      const { criteria } = criteriaFromDraft(fillDraft(createDraft(type as RubricType), "C", "x"));
      const c = criteria.C as { description: string; levels: Record<string, string> };
      expect(Object.keys(c)).toEqual(["description", "levels"]);
      expect(c.description).toBe("x desc");
      expect(Object.keys(c.levels)).toEqual(levels);
    }
  });

  it("developmental: { name: { description, stages } }", () => {
    const { criteria } = criteriaFromDraft(fillDraft(createDraft(RubricType.Developmental), "Voice", "x"));
    expect(criteria.Voice).toEqual({
      description: "x desc",
      stages: { Emerging: "x Emerging", Developing: "x Developing", Proficient: "x Proficient", Advanced: "x Advanced" },
    });
  });

  it("primary-trait: { name: { description, levels: { 4, 3, 2, 1 } } }", () => {
    const { criteria } = criteriaFromDraft(fillDraft(createDraft(RubricType.PrimaryTrait), "Thesis", "x"));
    expect(criteria.Thesis).toEqual({
      description: "x desc",
      levels: { "4": "x 4", "3": "x 3", "2": "x 2", "1": "x 1" },
    });
  });

  it("multi-trait: { trait: { description, subCriteria: { id: { description, levels } } } }", () => {
    const { criteria } = criteriaFromDraft(fillDraft(createDraft(RubricType.MultiTrait), "Voice", "x"));
    const trait = criteria.Voice as { description: string; subCriteria: Record<string, unknown> };
    expect(trait.description).toBe("x desc");
    const subs = Object.values(trait.subCriteria);
    expect(subs).toEqual([
      { description: "x sub", levels: { Excellent: "x Excellent", Good: "x Good", Fair: "x Fair", Poor: "x Poor" } },
    ]);
  });

  it("checklist: { item: 'Yes/No' }", () => {
    const { criteria } = criteriaFromDraft(createDraft(RubricType.Checklist));
    expect(criteria).toEqual(getInitialRubricState(RubricType.Checklist).criteria);
  });

  it("holistic: { level: text }", () => {
    const { criteria } = criteriaFromDraft(createDraft(RubricType.Holistic));
    expect(criteria).toEqual({ Excellent: "", Proficient: "", Developing: "", Beginning: "" });
  });

  it("single-point: { Proficient } plus top-level feedback", () => {
    const result = criteriaFromDraft(createDraft(RubricType.SinglePoint));
    expect(result).toEqual({
      criteria: { Proficient: "" },
      feedback: { Strengths: "", "Areas for Improvement": "" },
    });
  });
});

describe("draftFromRubric round-trips", () => {
  const samples: RubricState[] = [
    rubric(RubricType.Analytical, { A: { Excellent: "e", Beginning: "b" } }),
    rubric(RubricType.Holistic, { Excellent: "e", Poor: "p" }),
    rubric(RubricType.Checklist, { "Has intro": "Yes/No", Other: "Maybe" }),
    rubric(RubricType.Developmental, { Insight: { Beginning: "b", Mastery: "m" } }),
    rubric(RubricType.Developmental, { Insight: { description: "d", stages: { Emerging: "e" } } }),
    rubric(RubricType.TaskSpecific, { T: { description: "d", levels: { Excellent: "e" } } }),
    rubric(RubricType.PrimaryTrait, { T: { description: "d", levels: { "1": "one", "4": "four" } } }),
    rubric(RubricType.MultiTrait, {
      Voice: { description: "d", subCriteria: { "1700000000000": { description: "s", levels: { Good: "g" } } } },
    }),
    rubric(RubricType.SinglePoint, { Proficient: "p" }, { feedback: { Strengths: "s", "Areas for Improvement": "a" } } as Partial<RubricState>),
    rubric(RubricType.Analytical, {
      thesis: { "0": "none", "1": "some", points: 1 },
      evidence: { "0": { evidence: "x", commentary: "y" } },
    }),
  ];

  for (const sample of samples) {
    it(`${sample.type} ${JSON.stringify(sample.criteria).slice(0, 40)}`, () => {
      const out = applyDraft(sample, draftFromRubric(sample), { name: sample.name, description: sample.description ?? "" });
      expect(out).toEqual(sample);
    });
  }

  it("keeps unknown criteria as raw, uneditable entries", () => {
    const draft = draftFromRubric(samples[samples.length - 1]);
    expect(draft.criteria.map((c) => c.format)).toEqual(["raw", "raw"]);
  });

  it("keeps extra rubric fields (identity, tags, etc.) when applying a draft", () => {
    const base = rubric(RubricType.Holistic, { Excellent: "e" }, { identity: "student", tags: ["a"], isCustom: true });
    const out = applyDraft(base, draftFromRubric(base), { name: " New ", description: "Desc" });
    expect(out).toMatchObject({ identity: "student", tags: ["a"], isCustom: true, name: "New", id: "r1" });
  });
});

describe("createDraft / createCriterion", () => {
  it("seeds every criteria-list type with one blank criterion using the configured levels", () => {
    for (const type of RUBRIC_TYPES) {
      const config = RUBRIC_TYPE_CONFIG[type];
      const draft = createDraft(type);
      if (config.shape === "overall" || config.shape === "single-point") {
        expect(draft.criteria).toHaveLength(0);
        continue;
      }
      expect(draft.criteria.length).toBeGreaterThan(0);
      const c = createCriterion(config);
      if (config.shape === "levels" || config.shape === "described") {
        expect(c.levels.map((l) => l.label)).toEqual(config.defaultLevels);
      }
    }
  });

  it("gives each criterion a unique id", () => {
    const config = RUBRIC_TYPE_CONFIG[RubricType.Analytical];
    expect(createCriterion(config).id).not.toBe(createCriterion(config).id);
  });
});

describe("validateDraft", () => {
  it("requires named, unique criteria", () => {
    const draft = createDraft(RubricType.Analytical);
    expect(validateDraft(draft)).toContain("Every criterion needs a name.");
    const dup = { ...draft, criteria: [{ ...draft.criteria[0], name: "A" }, { ...draft.criteria[0], id: "x", name: "a " }] };
    expect(validateDraft(dup).some((e) => e.includes("Names must be unique"))).toBe(true);
  });

  it("passes for a filled-in rubric", () => {
    expect(validateDraft(fillDraft(createDraft(RubricType.MultiTrait), "Voice", "x"))).toEqual([]);
    expect(validateDraft(fillDraft(createDraft(RubricType.StandardsBased), "S", "x"))).toEqual([]);
  });

  it("requires a proficient description for single-point", () => {
    expect(validateDraft(createDraft(RubricType.SinglePoint))).toHaveLength(1);
  });
});

describe("moveItem", () => {
  it("moves and ignores out-of-range moves", () => {
    expect(moveItem([1, 2, 3], 0, 2)).toEqual([2, 3, 1]);
    expect(moveItem([1, 2, 3], 0, -1)).toEqual([1, 2, 3]);
  });
});
