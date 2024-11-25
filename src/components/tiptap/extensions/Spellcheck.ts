// extensions/Spellcheck.ts
import { Extension } from '@tiptap/core'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin } from 'prosemirror-state'
import nspell from 'nspell'
import affData from '@/dictionaries/en_US.aff'
import dicData from '@/dictionaries/en_US.dic'

type SpellcheckOptions = object;

interface SpellcheckStorage {
  spellchecker: nspell | null
}


export const Spellcheck = Extension.create<SpellcheckOptions, SpellcheckStorage>({
  name: 'spellcheck',

  addStorage() {
    return {
      spellchecker: null,
    }
  },

  async onCreate() {
    try {
      this.storage.spellchecker = new nspell(affData, dicData)


      // Re-render to apply spellcheck after dictionary is loaded
      this.editor.view.dispatch(this.editor.state.tr)
    } catch (error) {
      console.error('Error initializing spellchecker:', error)
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: state => {
            const decorations: Decoration[] = []
            const { doc } = state
            const spellchecker = this.storage.spellchecker

            if (!spellchecker) {
              return null
            }

            doc.descendants((node, pos) => {
              if (node.isText) {
                const text = node.text || ''
                const words = text.split(/\b/)

                let offset = 0

                words.forEach(word => {
                  const isWord = /\w+/.test(word)
                  if (isWord && !spellchecker.correct(word)) {
                    const from = pos + offset
                    const to = from + word.length

                    const decoration = Decoration.inline(from, to, {
                      class: 'spellcheck-error',
                    })
                    decorations.push(decoration)
                  }
                  offset += word.length
                })
              }
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})
