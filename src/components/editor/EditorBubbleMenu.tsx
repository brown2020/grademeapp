"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Bold, Italic, Underline } from "lucide-react";
import { ToolbarButton } from "./ToolbarButton";

const MAX_SUGGESTIONS = 5;

/** Selection menu: spelling suggestions for a misspelled word, otherwise B/I/U. */
export function EditorBubbleMenu({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      const { from, to, empty } = e.state.selection;
      const text = empty ? "" : e.state.doc.textBetween(from, to);
      const spellchecker = e.storage.spellcheck?.spellchecker;
      const misspelled =
        !!spellchecker && /\w+/.test(text) && !spellchecker.correct(text);
      return {
        from,
        to,
        misspelled,
        suggestions: misspelled && spellchecker
          ? spellchecker.suggest(text).slice(0, MAX_SUGGESTIONS)
          : [],
        bold: e.isActive("bold"),
        italic: e.isActive("italic"),
        underline: e.isActive("underline"),
      };
    },
  });

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ state: s }) => !s.selection.empty}
      className="flex max-w-[90vw] flex-wrap items-center gap-0.5 rounded-lg border border-border bg-surface p-1 text-sm shadow-raised"
    >
      {state.misspelled ? (
        state.suggestions.length > 0 ? (
          state.suggestions.map((suggestion) => (
            <button
              type="button"
              key={suggestion}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertContentAt({ from: state.from, to: state.to }, suggestion)
                  .run()
              }
              className="rounded-md px-2 py-1 text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
            >
              {suggestion}
            </button>
          ))
        ) : (
          <span className="px-2 py-1 text-xs text-muted-foreground">No suggestions</span>
        )
      ) : (
        <>
          <ToolbarButton
            label="Bold"
            active={state.bold}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold />
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            active={state.italic}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic />
          </ToolbarButton>
          <ToolbarButton
            label="Underline"
            active={state.underline}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Underline />
          </ToolbarButton>
        </>
      )}
    </BubbleMenu>
  );
}
