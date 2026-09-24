import { describe, expect, it } from "vitest";
import { RubricType, type RubricState } from "@/lib/types/rubrics-types";
import {
  filterRubricsByQuery,
  groupRubrics,
  pickSuggestedRubric,
  sortRubricsByRelevance,
} from "./rubricSorting";

const r = (id: string, fields: Partial<RubricState> = {}): RubricState =>
  ({ id, name: id, description: "", type: RubricType.Analytical, criteria: {}, ...fields }) as RubricState;

const ctx = { identity: "student", identityLevel: "9th grade", textType: "narrative" };

const rubrics = [
  r("none", { identity: "professional", identityLevel: "senior", textType: "report" }),
  r("typeOnly", { identity: "professional", textType: "Narrative" }),
  r("identityOnly", { identity: "student", textType: "report" }),
  r("typeAndIdentity", { identity: "student", textType: "narrative" }),
  r("levelOnly", { identity: "x", identityLevel: "9th grade", textType: "report" }),
  r("levelAndType", { identity: "x", identityLevel: "9th grade", textType: "narrative" }),
  r("exact", { identity: "student", identityLevel: "9th grade", textType: "narrative" }),
];

describe("sortRubricsByRelevance", () => {
  it("orders by the legacy relevance tiers", () => {
    expect(sortRubricsByRelevance(rubrics, ctx).map((x) => x.id)).toEqual([
      "exact",
      "levelAndType",
      "levelOnly",
      "typeAndIdentity",
      "identityOnly",
      "typeOnly",
      "none",
    ]);
  });

  it("puts favourites first, without duplicating them", () => {
    const sorted = sortRubricsByRelevance(rubrics, { ...ctx, favoriteIds: ["none"] });
    expect(sorted[0].id).toBe("none");
    expect(sorted.filter((x) => x.id === "none")).toHaveLength(1);
    expect(sorted).toHaveLength(rubrics.length);
  });
});

describe("groupRubrics", () => {
  it("returns labelled, non-empty groups", () => {
    const groups = groupRubrics(rubrics, { ...ctx, favoriteIds: ["typeOnly"] });
    expect(groups.map((g) => g.key)).toEqual(["favorites", "best", "suggested", "other"]);
    expect(groups[2].rubrics.map((x) => x.id)).toEqual(["levelAndType", "levelOnly", "typeAndIdentity", "identityOnly"]);
    expect(groupRubrics([r("none")], { identity: "a", textType: "b" }).map((g) => g.key)).toEqual(["other"]);
  });
});

describe("pickSuggestedRubric", () => {
  it("prefers an exact match, else the top result, else null", () => {
    expect(pickSuggestedRubric(rubrics, ctx)?.id).toBe("exact");
    expect(pickSuggestedRubric(rubrics, { ...ctx, favoriteIds: ["none"] })?.id).toBe("exact");
    expect(pickSuggestedRubric([r("a"), r("b")], ctx)?.id).toBe("a");
    expect(pickSuggestedRubric([], ctx)).toBeNull();
  });
});

describe("filterRubricsByQuery", () => {
  it("matches name or description case-insensitively", () => {
    const list = [r("Essay"), r("Other", { description: "for essays" }), r("Lab")];
    expect(filterRubricsByQuery(list, " ESSAY ").map((x) => x.id)).toEqual(["Essay", "Other"]);
    expect(filterRubricsByQuery(list, "")).toBe(list);
  });
});
