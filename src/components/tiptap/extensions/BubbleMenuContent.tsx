import BubbleMenuFormatButtons from "./BubbleMenuFormatButtons"
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
              type="button"
              key={suggestion}
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
  }

  return <BubbleMenuFormatButtons editor={editor} />
}

export default BubbleMenuContent
