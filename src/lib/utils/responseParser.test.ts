import { describe, it, expect } from "vitest";
import { extractGrade } from "@/lib/utils/responseParser";

describe("extractGrade", () => {
  it("extracts a percentage grade from a feedback string", () => {
    expect(extractGrade("Overall Grade: 85%. Nice work.")).toBe("85%");
  });

  it("is case-insensitive on the 'Grade' label", () => {
    expect(extractGrade("grade: 100%")).toBe("100%");
  });

  it("matches the first grade-labeled percentage when text precedes it", () => {
    expect(
      extractGrade("Here is detailed feedback.\n\nGrade: 7%\nKeep going.")
    ).toBe("7%");
  });

  it("returns 'N/A' when no labeled grade is present", () => {
    expect(extractGrade("This essay is 90% complete but has no grade label."))
      .toBe("N/A");
  });

  it("returns 'N/A' for an empty string", () => {
    expect(extractGrade("")).toBe("N/A");
  });
});
