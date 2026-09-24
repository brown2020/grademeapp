"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Underline,
  Undo2,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FontFamilySelect } from "./FontFamilySelect";
import { ToolbarButton, ToolbarDivider } from "./ToolbarButton";

const ALIGNMENTS = [
  { value: "left", label: "Align left", icon: AlignLeft },
  { value: "center", label: "Align center", icon: AlignCenter },
  { value: "right", label: "Align right", icon: AlignRight },
  { value: "justify", label: "Justify", icon: AlignJustify },
] as const;

export function EditorToolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bulletList: e.isActive("bulletList"),
      orderedList: e.isActive("orderedList"),
      align: ALIGNMENTS.find((a) => e.isActive({ textAlign: a.value }))?.value ?? "left",
      fontFamily: e.getAttributes("textStyle").fontFamily as string | undefined,
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();
  const AlignIcon = ALIGNMENTS.find((a) => a.value === state.align)?.icon ?? AlignLeft;

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="scrollbar-thin flex items-center gap-0.5 overflow-x-auto border-b border-border px-2 py-1.5"
    >
      <FontFamilySelect editor={editor} value={state.fontFamily} />
      <ToolbarDivider />
      <ToolbarButton label="Bold" active={state.bold} onClick={() => chain().toggleBold().run()}>
        <Bold />
      </ToolbarButton>
      <ToolbarButton label="Italic" active={state.italic} onClick={() => chain().toggleItalic().run()}>
        <Italic />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={state.underline}
        onClick={() => chain().toggleUnderline().run()}
      >
        <Underline />
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        label="Heading"
        active={state.h2}
        onClick={() => chain().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 />
      </ToolbarButton>
      <ToolbarButton
        label="Subheading"
        active={state.h3}
        onClick={() => chain().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 />
      </ToolbarButton>
      <ToolbarButton
        label="Bullet list"
        active={state.bulletList}
        onClick={() => chain().toggleBulletList().run()}
      >
        <List />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={state.orderedList}
        onClick={() => chain().toggleOrderedList().run()}
      >
        <ListOrdered />
      </ToolbarButton>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Text alignment"
            title="Text alignment"
            className="text-muted-foreground hover:text-foreground"
          >
            <AlignIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="flex w-auto gap-0.5 p-1">
          {ALIGNMENTS.map(({ value, label, icon: Icon }) => (
            <ToolbarButton
              key={value}
              label={label}
              active={state.align === value}
              onClick={() => chain().setTextAlign(value).run()}
            >
              <Icon />
            </ToolbarButton>
          ))}
        </PopoverContent>
      </Popover>
      <ToolbarDivider />
      <ToolbarButton label="Undo" disabled={!state.canUndo} onClick={() => chain().undo().run()}>
        <Undo2 />
      </ToolbarButton>
      <ToolbarButton label="Redo" disabled={!state.canRedo} onClick={() => chain().redo().run()}>
        <Redo2 />
      </ToolbarButton>
    </div>
  );
}
