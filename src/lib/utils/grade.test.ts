import { describe, expect, it } from "vitest";
import { gradeTone } from "@/lib/utils/grade";

describe("gradeTone", () => {
  it.each([
    ["95%", "success"],
    ["90%", "success"],
    ["85%", "primary"],
    ["75", "primary"],
    ["74.5%", "warning"],
    ["60%", "warning"],
    ["59%", "danger"],
    ["0%", "danger"],
  ])("maps %s to %s", (grade, tone) => {
    expect(gradeTone(grade)).toBe(tone);
  });

  it("is neutral for missing or non-numeric grades", () => {
    expect(gradeTone(undefined)).toBe("neutral");
    expect(gradeTone(null)).toBe("neutral");
    expect(gradeTone("N/A")).toBe("neutral");
  });
});
