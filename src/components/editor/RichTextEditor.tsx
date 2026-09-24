"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { Skeleton } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { createExtensions, handlePlainTextPaste } from "./extensions";
import { EditorToolbar } from "./EditorToolbar";
import { EditorBubbleMenu } from "./EditorBubbleMenu";
import { WordCount } from "./WordCount";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  placeholder?: string;
  wordLimit?: string;
  wordLimitType?: string;
  /** Extra controls shown on the right of the footer (upload, clear, …). */
  footerActions?: ReactNode;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  label = "Essay text",
  placeholder = "Start writing, or paste your draft here…",
  wordLimit,
  wordLimitType,
  footerActions,
  className,
}: RichTextEditorProps) {
  const extensions = useMemo(() => createExtensions(placeholder), [placeholder]);
  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    content: value,
    editorProps: {
      handlePaste: (view, event) => handlePlainTextPaste(view, event),
      attributes: {
        "aria-label": label,
        "aria-multiline": "true",
        role: "textbox",
        class: "min-h-[22rem] px-5 py-5 sm:px-8 sm:py-6",
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  const words = useEditorState({
    editor,
    selector: ({ editor: e }) => e?.storage.characterCount.words() ?? 0,
  });

  // Keep the editor in sync when the text is replaced from outside
  // (file upload, grammar correction, loading a saved submission).
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border border-border bg-surface shadow-soft focus-within:border-ring",
        className
      )}
    >
      {editor ? (
        <>
          <EditorToolbar editor={editor} />
          <EditorBubbleMenu editor={editor} />
          <EditorContent editor={editor} className="flex-1" />
        </>
      ) : (
        <div className="flex min-h-[25rem] flex-col gap-3 p-5 sm:p-8">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2 sm:px-4">
        <WordCount words={words ?? 0} wordLimit={wordLimit} wordLimitType={wordLimitType} />
        {footerActions && <div className="flex flex-wrap items-center gap-1">{footerActions}</div>}
      </div>
    </div>
  );
}
