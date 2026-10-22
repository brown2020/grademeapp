import type { OfficeContentNode } from "officeparser";

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Blank lines separate paragraphs; single newlines become line breaks. */
export function plainTextToHtml(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => `<p>${escapeHtml(para).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

/** Wrapped lines inside one paragraph (PDF layout) join with a space. */
const inline = (text: string) => escapeHtml(text.replace(/\s*\n\s*/g, " ").trim());

/**
 * Editor HTML from an officeparser content tree (PDF, ODT): headings and
 * paragraphs become block elements, lists become `<ul>`, containers recurse.
 */
export function officeNodesToHtml(nodes: OfficeContentNode[]): string {
  return nodes.map(nodeToHtml).join("");
}

function nodeToHtml(node: OfficeContentNode): string {
  const text = node.text ? inline(node.text) : "";
  switch (node.type) {
    case "heading": {
      const level = Math.min(6, Math.max(1, node.metadata?.level ?? 1));
      return text ? `<h${level}>${text}</h${level}>` : "";
    }
    case "paragraph":
    case "text":
      return text ? `<p>${text}</p>` : "";
    case "list": {
      const items = (node.children ?? []).map((child) => (child.text ? inline(child.text) : "")).filter(Boolean);
      return items.length ? `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>` : "";
    }
    case "header":
    case "footer":
    case "comment":
    case "note":
    case "image":
    case "chart":
    case "drawing":
      return "";
    default:
      return node.children?.length ? officeNodesToHtml(node.children) : text ? `<p>${text}</p>` : "";
  }
}
