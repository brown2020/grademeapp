import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "./sanitizeHtml";

describe("sanitizeHtml", () => {
  it("keeps formatting tags and a plain class", () => {
    expect(sanitizeHtml('<p class="essay">Hi <strong>there</strong></p>')).toBe(
      '<p class="essay">Hi <strong>there</strong></p>'
    );
  });

  it("strips scripts, handlers, and links", () => {
    const dirty = '<p onclick="alert(1)">x</p><script>alert(1)</script><a href="javascript:alert(1)">go</a>';
    expect(sanitizeHtml(dirty)).toBe("<p>x</p>alert(1)go");
  });

  it("drops a class that is not a plain token list", () => {
    expect(sanitizeHtml('<span class="ok"><span class="a<b">x</span></span>')).toBe(
      '<span class="ok"><span>x</span></span>'
    );
  });
});
