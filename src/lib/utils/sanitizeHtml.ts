const ALLOWED = new Set(["p", "br", "strong", "em", "u", "h2", "h3", "ul", "ol", "li", "span", "b", "i"]);
const CLASS_NAME = /^[a-zA-Z0-9_\- ]*$/;

/**
 * Keeps a small set of formatting tags from saved essay HTML and drops every
 * attribute except a plain `class`. Unknown tags are removed; their text stays.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<\/?\s*([a-zA-Z0-9]+)([^>]*)>/g, (match, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED.has(tag)) return "";
    if (match.startsWith("</")) return `</${tag}>`;
    if (tag === "br") return "<br>";
    const classMatch = /\bclass\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(rawAttrs);
    const className = (classMatch?.[1] ?? classMatch?.[2] ?? "").trim();
    if (className && CLASS_NAME.test(className)) return `<${tag} class="${className}">`;
    return `<${tag}>`;
  });
}
