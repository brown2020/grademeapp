import { describe, expect, it } from "vitest";
import type { OfficeContentNode } from "officeparser";
import { escapeHtml, officeNodesToHtml, plainTextToHtml } from "./documentHtml";

const node = (n: Partial<OfficeContentNode> & { type: string }) => n as OfficeContentNode;

describe("documentHtml", () => {
  it("escapes markup in document text", () => {
    expect(escapeHtml(`<script>"x" & y</script>`)).toBe("&lt;script&gt;&quot;x&quot; &amp; y&lt;/script&gt;");
  });

  it("turns plain text paragraphs and line breaks into safe HTML", () => {
    expect(plainTextToHtml("One\nline two\r\n\r\n<b>Two</b>\n\n\n")).toBe("<p>One<br>line two</p><p>&lt;b&gt;Two&lt;/b&gt;</p>");
  });

  it("maps headings, paragraphs, lists and pages; joins wrapped lines; skips headers", () => {
    const html = officeNodesToHtml([
      node({ type: "page", children: [
        node({ type: "header", text: "Page 1" }),
        node({ type: "heading", text: "Title", metadata: { level: 9 } as never }),
        node({ type: "paragraph", text: "wrapped first\nsecond line" }),
        node({ type: "list", children: [node({ type: "paragraph", text: "a" }), node({ type: "paragraph", text: "b & c" })] }),
        node({ type: "paragraph", text: "   " }),
      ] }),
    ]);
    expect(html).toBe("<h6>Title</h6><p>wrapped first second line</p><ul><li>a</li><li>b &amp; c</li></ul>");
  });
});
