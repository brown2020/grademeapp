import type nspell from "nspell";

declare module "@tiptap/core" {
  interface Storage {
    spellcheck?: {
      spellchecker: nspell | null;
    };
  }
}

export {};
