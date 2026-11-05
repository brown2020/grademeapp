import { describe, expect, it } from "vitest";
import { pageViewParams } from "./pageView";

describe("pageViewParams", () => {
  it("keeps the query string on page_path", () => {
    expect(
      pageViewParams("/grader", "?draft=1", "https://grade.me/grader?draft=1", "Grade"),
    ).toEqual({
      page_path: "/grader?draft=1",
      page_location: "https://grade.me/grader?draft=1",
      page_title: "Grade",
    });
  });

  it("omits an empty search and normalizes a relative path", () => {
    expect(pageViewParams("rubrics", "", "https://grade.me/rubrics", "Rubrics")).toEqual({
      page_path: "/rubrics",
      page_location: "https://grade.me/rubrics",
      page_title: "Rubrics",
    });
  });
});
