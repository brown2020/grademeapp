import { describe, expect, it } from "vitest";
import { countWords, estimateScanCredits, excerpt, htmlToPlainText } from "./report";

describe("htmlToPlainText", () => {
  it("turns editor HTML into the words a reader sees", () => {
    const html = '<p class="essay">Hello <strong>world</strong></p><p>Second&nbsp;line</p>';
    expect(htmlToPlainText(html)).toBe("Hello world\nSecond line");
    expect(countWords(html)).toBe(4);
  });

  it("does not treat markup-looking prose as tags", () => {
    expect(htmlToPlainText("a < b and c > d")).toBe("a < b and c > d");
    expect(countWords("a < b and c > d")).toBe(7);
  });

  it("drops scripts and decodes entities before counting", () => {
    const html = "<p>Cats &amp; dogs</p><script>alert(1)</script>";
    expect(htmlToPlainText(html)).toBe("Cats & dogs");
    expect(countWords(html)).toBe(3);
    expect(estimateScanCredits(html)).toBe(estimateScanCredits("Cats & dogs"));
  });

  it("excerpts the plain text, not the tags", () => {
    expect(excerpt('<p class="x">A short essay about rivers.</p>')).toBe("A short essay about rivers.");
  });
});
