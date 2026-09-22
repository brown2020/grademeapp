import { Editor } from "@tiptap/react";

export default function BubbleMenuFormatButtons({ editor }: { editor: Editor }) {
  return (
    <div className="flex space-x-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 rounded ${editor.isActive("bold") ? "bg-secondary-99" : ""}`}
        title="Bold (Ctrl+B)"
      >
        <b>B</b>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 rounded ${editor.isActive("italic") ? "bg-secondary-99" : ""}`}
        title="Italic (Ctrl+I)"
      >
        <i>I</i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-2 rounded ${editor.isActive("underline") ? "bg-secondary-99" : ""}`}
        title="Underline (Ctrl+U)"
      >
        <u>U</u>
      </button>
    </div>
  );
}
