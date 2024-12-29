import React from 'react'
import { Editor } from '@tiptap/react'
import NSpell from 'nspell'

interface BubbleMenuContentProps {
  editor: Editor
}

const BubbleMenuContent: React.FC<BubbleMenuContentProps> = ({ editor }) => {
  const { from, to, empty } = editor.state.selection

  if (empty) {
    return null
  }

  const selectedText = editor.state.doc.textBetween(from, to)
  const spellcheckerStorage = editor.storage.spellcheck

  if (!spellcheckerStorage || !spellcheckerStorage.spellchecker) {
    return null
  }

  const spellchecker = spellcheckerStorage.spellchecker as NSpell

  let isMisspelled = false
  let suggestions: string[] = []

  if (spellchecker && selectedText && /\w+/.test(selectedText)) {
    isMisspelled = !spellchecker.correct(selectedText)
    if (isMisspelled) {
      suggestions = spellchecker.suggest(selectedText)
    }
  }

  if (isMisspelled) {
    return (
      <div className="">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                editor.chain().focus().insertContentAt({ from, to }, suggestion).run()
              }}
              className="px-2 cursor-pointer hover:bg-secondary-95 rounded-xl text-left"
            >
              {suggestion}
            </button>
          ))
        ) : (
          <div className="px-2 text-secondary-95 text-xs font-medium">No suggestions</div>
        )}
      </div>
    )
  } else {
    // Display regular formatting options
    return (
      <div className="flex space-x-2">
        {/* Bold Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 rounded ${editor.isActive('bold') ? 'bg-secondary-99' : ''
            }`}
          title="Bold (Ctrl+B)"
        >
          <b>B</b>
        </button>
        {/* Italic Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 rounded ${editor.isActive('italic') ? 'bg-secondary-99' : ''
            }`}
          title="Italic (Ctrl+I)"
        >
          <i>I</i>
        </button>
        {/* Underline Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 rounded ${editor.isActive('underline') ? 'bg-secondary-99' : ''
            }`}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
      </div>
    )
  }
}

export default BubbleMenuContent
