'use client'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import { mergeAttributes } from '@tiptap/core'
import HardBreak from "@tiptap/extension-hard-break"
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import { ListItem } from '@tiptap/extension-list-item'
import { BulletList } from '@tiptap/extension-bullet-list'
import { OrderedList } from '@tiptap/extension-ordered-list'
import CharacterCount from '@tiptap/extension-character-count'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import { HeadingIcon, List, ListOrdered, AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon } from 'lucide-react'
import { useEffect } from 'react'
import { Popover, PopoverPanel, PopoverButton } from '@headlessui/react'
import FontFamilyDropdown from '@/components/menus/TextMenu/components/FontFamilyDropdown'

interface TiptapProps {
  wordLimit: string;
  wordLimitType: string;
  editorContent: string;
  onChange: (content: string) => void;
}

const CustomParagraph = Paragraph.extend({
  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes, { class: 'mb-4' }), 0];
  },
});

const Tiptap = ({ wordLimit, wordLimitType, editorContent, onChange }: TiptapProps) => {

  // console.log(editorContent)

  const editor = useEditor({
    extensions: [
      Document,
      Heading.configure({
        HTMLAttributes: {
          class: "text-xl font-bold capitalize mb-4",
          levels: [2],
        },
      }),
      CustomParagraph,
      Text,
      ListItem,
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-2",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-2",
        },
      }),
      Bold,
      Italic,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      TextStyle,
      FontFamily,
      CharacterCount.configure({
        wordCounter: (text) => text.split(/\s+/).filter((word) => word !== '').length,
      }),
      HardBreak.configure({
        HTMLAttributes: {
          class: 'hard-break',
        },
      })
    ],
    immediatelyRender: false,
    editorProps: {
      handlePaste(view, event) {
        const text = event.clipboardData?.getData("text/plain");
        if (text) {
          const formattedText = text.replace(/\n/g, "<br>");
          view.dispatch(view.state.tr.insertText(formattedText));
          event.preventDefault();
          return true;
        }
        return false;
      },
      attributes: {
        class:
          "shadow appearance-none h-[300px] overflow-y-scroll border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
      },
    },
    content: editorContent,
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();
      onChange(updatedContent);
    },
  });

  // Sync initial content when `editorContent` prop changes
  useEffect(() => {
    if (editor && editorContent !== editor.getHTML()) {
      editor.commands.setContent(editorContent);
    }
  }, [editorContent, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col justify-stretch min-h-[200px]">
      {wordLimit && (
        <div className='flex bg-accent px-3 py-1 mb-1 rounded-full text-accent-foreground'>
          {wordLimitType === "less than" ? (
            <div className="flex">
              {editor.storage.characterCount.words()} of {wordLimit} word limit.
            </div>
          ) : wordLimitType === "more than" ? (
            <div className="flex">
              {editor.storage.characterCount.words()} of {wordLimit} word limit.
            </div>
          ) : wordLimitType === "between" && (editor.storage.characterCount.words() ? (
            <div className="flex">
              {editor.storage.characterCount.words()} out of the {wordLimit} word limit.
            </div>
          ) : null
          )}
        </div>
      )}
      <div className="flex items-center gap-2 mb-2 p-1 bg-gray-200 rounded-full">
        {/* FontFamily Dropdown */}
        <FontFamilyDropdown editor={editor} />
        {/* Bold Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`size-8 rounded ${editor.isActive("bold") ? "is-active bg-gray-300" : ""
            }`}
          title="Bold (Ctrl+B)"
        >
          <b>b</b>
        </button>
        {/* Italic Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`size-8 rounded ${editor.isActive("italic") ? "is-active bg-gray-300" : ""
            }`}
          title="Italic (Ctrl+I)"
        >
          <i>i</i>
        </button>
        {/* Underline Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`size-8 rounded ${editor.isActive("underline") ? "is-active bg-gray-300" : ""
            }`}
          title="Underline (Ctrl+U)"
        >
          <u>u</u>
        </button>
        {/* Heading */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`size-8 rounded place-items-center ${editor.isActive("heading", { level: 2 }) ? "is-active bg-gray-300" : ""}`}
        >
          <HeadingIcon size={18} />
        </button>
        {/* Bullet List Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded ${editor.isActive("bulletList") ? "bg-gray-300" : ""
            }`}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        {/* Ordered List Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded ${editor.isActive("orderedList") ? "bg-gray-300" : ""
            }`}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </button>
        {/* Alignments popover */}
        <Popover className="flex relative">
          {({ open }) => (
            <>
              <PopoverButton className={`p-1 rounded ${open ? "bg-gray-300" : ""
                }`}>
                <AlignLeftIcon size={18} />
              </PopoverButton>
              <PopoverPanel className="absolute z-10 right-0 top-8 flex flex-row gap-0 bg-white rounded-lg shadow-md">
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  className={`p-1 rounded ${editor.isActive("textAlign", { align: "left" }) ? "bg-gray-300" : ""
                    }`}
                >
                  <AlignLeftIcon size={18} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  className={`p-1 rounded ${editor.isActive("textAlign", { align: "center" }) ? "bg-gray-300" : ""
                    }`}
                >
                  <AlignCenterIcon size={18} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  className={`p-1 rounded ${editor.isActive("textAlign", { align: "right" }) ? "bg-gray-300" : ""
                    }`}
                >
                  <AlignRightIcon size={18} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("justify").run()
                  }
                  className={`p-1 rounded ${editor.isActive("textAlign", { align: "justify" }) ? "bg-gray-300" : ""
                    }`}
                >
                  <AlignJustifyIcon size={18} />
                </button>
              </PopoverPanel>
            </>
          )}
        </Popover>
      </div>

      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="bubble-menu">
          {/* Bold Button */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`size-8 rounded ${editor.isActive("bold") ? "is-active bg-gray-300" : ""
              }`}
            title="Bold (Ctrl+B)"
          >
            <b>b</b>
          </button>
          {/* Italic Button */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`size-8 rounded ${editor.isActive("italic") ? "is-active bg-gray-300" : ""
              }`}
            title="Italic (Ctrl+I)"
          >
            <i>i</i>
          </button>
          {/* Underline Button */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`size-8 rounded ${editor.isActive("underline") ? "is-active bg-gray-300" : ""
              }`}
            title="Underline (Ctrl+U)"
          >
            <u>u</u>
          </button>
        </div>
      </BubbleMenu>
      {/* Editor Content */}
      <EditorContent className='' editor={editor} />
    </div>
  )
}
export default Tiptap