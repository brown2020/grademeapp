import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ cookie: undefined as string | undefined }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => (state.cookie ? { value: state.cookie } : undefined) }),
}));
vi.mock("@/firebase/firebaseAdmin", () => ({
  adminAuth: { verifyIdToken: async (token: string) => ({ uid: token.replace("token-", "") }) },
}));

process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET = "grademe-test.appspot.com";
const { parseDocumentFromUrl } = await import("./parseDocumentFromUrl");

const fixture = (name: string) => readFileSync(new URL(`./__fixtures__/${name}`, import.meta.url));
const uploadUrl = (name: string, uid = "alice") =>
  `https://firebasestorage.googleapis.com/v0/b/grademe-test.appspot.com/o/${encodeURIComponent(`uploads/${uid}/${name}`)}?alt=media&token=t`;
const serve = (body: Buffer | string, contentType: string) =>
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(typeof body === "string" ? body : new Uint8Array(body), { headers: { "content-type": contentType } }));

beforeEach(() => {
  vi.restoreAllMocks();
  state.cookie = "token-alice";
});

describe("parseDocumentFromUrl", () => {
  it("requires a session and the caller's own upload URL, without fetching otherwise", async () => {
    const fetchSpy = serve("x", "text/plain");
    state.cookie = undefined;
    await expect(parseDocumentFromUrl(uploadUrl("a.txt"))).rejects.toThrow();
    state.cookie = "token-alice";
    await expect(parseDocumentFromUrl(uploadUrl("a.txt", "bob"))).rejects.toThrow(/your own/);
    await expect(parseDocumentFromUrl("https://example.com/a.txt")).rejects.toThrow(/your own/);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("parses a modern PDF (cross-reference streams) into paragraphs", async () => {
    serve(fixture("essay.pdf"), "application/pdf");
    const html = await parseDocumentFromUrl(uploadUrl("essay.pdf"));
    expect(html).toContain("<p>The Raccoon Tax</p>");
    expect(html).toContain("<p>Every summer my grandmother grew tomatoes along the back fence, and every summer she lost half of them to the same family of raccoons.</p>");
    expect(html.match(/<p>/g)).toHaveLength(4);
  });

  it("parses ODT headings and escapes text", async () => {
    serve(fixture("essay.odt"), "application/vnd.oasis.opendocument.text");
    const html = await parseDocumentFromUrl(uploadUrl("essay.odt"));
    expect(html).toContain("<h1>The Raccoon Tax</h1>");
    expect(html).toContain("&amp; &lt;angle&gt; chars.");
  });

  it("parses DOCX with formatting", async () => {
    serve(fixture("essay.docx"), "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    const html = await parseDocumentFromUrl(uploadUrl("essay.docx"));
    expect(html).toContain("<h1>The Raccoon Tax</h1>");
  });

  it("parses TXT and RTF", async () => {
    serve("Line one\n\n<b>Line two</b>", "text/plain");
    expect(await parseDocumentFromUrl(uploadUrl("a.txt"))).toBe("<p>Line one</p><p>&lt;b&gt;Line two&lt;/b&gt;</p>");
    serve(
      String.raw`{\rtf1\ansi\deff0 {\fonttbl {\f0 Times;}}\f0 Hello {\b world}.\par Caf\'e9 \ldblquote quotes\rdblquote  & <b>tags</b>.\par}`,
      "application/rtf"
    );
    expect(await parseDocumentFromUrl(uploadUrl("a.rtf"))).toBe(
      "<p>Hello world.</p><p>Café “quotes” &amp; &lt;b&gt;tags&lt;/b&gt;.</p>"
    );
  });

  it("rejects unsupported types and oversized files instead of returning error text", async () => {
    serve("x", "image/png");
    await expect(parseDocumentFromUrl(uploadUrl("a.png"))).rejects.toThrow(/Unsupported file type/);
    serve(Buffer.alloc(10 * 1024 * 1024 + 1), "text/plain");
    await expect(parseDocumentFromUrl(uploadUrl("big.txt"))).rejects.toThrow(/over 10 MB/);
  });
});
