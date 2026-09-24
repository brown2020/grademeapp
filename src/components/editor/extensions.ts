import type { EditorView } from "@tiptap/pm/view";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { CharacterCount, Placeholder, UndoRedo } from "@tiptap/extensions";
import { Spellcheck } from "./spellcheck";

export const countWords = (text: string) =>
  text.split(/\s+/).filter((word) => word !== "").length;

export function createExtensions(placeholder: string) {
  return [
    Document,
    Paragraph,
    Text,
    HardBreak,
    Heading.configure({
      levels: [2, 3],
      HTMLAttributes: { class: "font-serif font-semibold mt-2 mb-3" },
    }),
    Bold,
    Italic,
    Underline,
    ListItem,
    BulletList.configure({ HTMLAttributes: { class: "list-disc pl-6 mb-4" } }),
    OrderedList.configure({ HTMLAttributes: { class: "list-decimal pl-6 mb-4" } }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
      defaultAlignment: "left",
      alignments: ["left", "center", "right", "justify"],
    }),
    TextStyle,
    FontFamily,
    UndoRedo,
    Spellcheck,
    Placeholder.configure({ placeholder }),
    CharacterCount.configure({ wordCounter: countWords }),
  ];
}

/**
 * Pastes plain text as one paragraph per blank-line-separated block, replacing
 * the document (or current empty paragraph) instead of nesting inside it.
 */
export function handlePlainTextPaste(view: EditorView, event: ClipboardEvent) {
  const text = event.clipboardData?.getData("text/plain");
  if (!text) return false;
  event.preventDefault();

  const { tr, doc, schema } = view.state;
  const { from, to, $from } = view.state.selection;
  const paragraphs = text.split(/\r?\n{2,}/).filter((p) => p.trim() !== "");

  const isEmptyDocument =
    doc.content.childCount === 1 &&
    doc.content.firstChild?.type.name === "paragraph" &&
    doc.content.firstChild.content.size === 0;
  const isInEmptyParagraph =
    $from.parent.type.name === "paragraph" && $from.parent.content.size === 0;

  let insertPos: number;
  if (isEmptyDocument) {
    tr.delete(0, doc.content.size);
    insertPos = 0;
  } else if (isInEmptyParagraph) {
    tr.deleteRange($from.start(), $from.end());
    insertPos = $from.start();
  } else {
    tr.deleteRange(from, to);
    insertPos = from;
  }

  for (const paragraph of paragraphs) {
    const node = schema.nodes.paragraph.create(
      undefined,
      schema.text(paragraph.trim().replace(/\r?\n/g, " "))
    );
    tr.insert(insertPos, node);
    insertPos += node.nodeSize;
  }

  view.dispatch(tr);
  return true;
}
