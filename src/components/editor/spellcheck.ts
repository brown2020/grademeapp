import { Extension } from "@tiptap/core";
import { Decoration, DecorationSet } from "prosemirror-view";
import { Plugin } from "prosemirror-state";
import nspell from "nspell";
import affData from "@/lib/dictionaries/en_US.aff";
import dicData from "@/lib/dictionaries/en_US.dic";

interface SpellcheckStorage {
  spellchecker: nspell | null;
}

const ERROR_CLASS =
  "spellcheck-error underline decoration-wavy decoration-destructive/70 underline-offset-4";

/** Underlines misspelled words using a bundled en_US Hunspell dictionary. */
export const Spellcheck = Extension.create<object, SpellcheckStorage>({
  name: "spellcheck",

  addStorage() {
    return { spellchecker: null };
  },

  onCreate() {
    try {
      this.storage.spellchecker = new nspell(affData, dicData);
      // Re-run decorations now that the dictionary is ready.
      this.editor.view.dispatch(this.editor.state.tr);
    } catch (error) {
      console.error("Error initializing spellchecker:", error);
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: (state) => {
            const spellchecker = this.storage.spellchecker;
            if (!spellchecker) return null;

            const decorations: Decoration[] = [];
            state.doc.descendants((node, pos) => {
              if (!node.isText) return;
              let offset = 0;
              for (const word of (node.text ?? "").split(/\b/)) {
                if (/\w+/.test(word) && !spellchecker.correct(word)) {
                  const from = pos + offset;
                  decorations.push(
                    Decoration.inline(from, from + word.length, { class: ERROR_CLASS })
                  );
                }
                offset += word.length;
              }
            });
            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});
