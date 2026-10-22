import { Extension } from "@tiptap/core";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { Plugin } from "@tiptap/pm/state";
import type nspell from "nspell";

interface SpellcheckStorage {
  spellchecker: nspell | null;
}

const ERROR_CLASS =
  "spellcheck-error underline decoration-wavy decoration-destructive/70 underline-offset-4";

/* Served from /public so the ~550 KB word list is a cached static asset
   fetched after the editor mounts, not part of the grader's JavaScript. */
const DICTIONARY_URL = "/dictionaries/en_US";

async function loadSpellchecker(): Promise<nspell> {
  const fetchText = async (ext: "aff" | "dic") => {
    const res = await fetch(`${DICTIONARY_URL}.${ext}`);
    if (!res.ok) throw new Error(`Dictionary ${ext} request failed: ${res.status}`);
    return res.text();
  };
  const [{ default: NSpell }, aff, dic] = await Promise.all([
    import("nspell"),
    fetchText("aff"),
    fetchText("dic"),
  ]);
  return new NSpell(aff, dic);
}

/** Underlines misspelled words using an en_US Hunspell dictionary loaded on demand. */
export const Spellcheck = Extension.create<object, SpellcheckStorage>({
  name: "spellcheck",

  addStorage() {
    return { spellchecker: null };
  },

  onCreate() {
    loadSpellchecker()
      .then((spellchecker) => {
        if (this.editor.isDestroyed) return;
        this.storage.spellchecker = spellchecker;
        // Re-run decorations now that the dictionary is ready.
        this.editor.view.dispatch(this.editor.state.tr);
      })
      .catch((error) => {
        // Spellcheck is an enhancement; the editor stays fully usable without it.
        console.warn("[spellcheck] unavailable:", error instanceof Error ? error.message : error);
      });
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
