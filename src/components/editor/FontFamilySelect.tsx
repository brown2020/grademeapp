"use client";

import type { Editor } from "@tiptap/react";
import { SimpleSelect } from "@/components/ui/select";

const DEFAULT_FONT = "default";

const FONT_OPTIONS = [
  { label: "Default", value: DEFAULT_FONT },
  { label: "Inter", value: "Inter" },
  { label: "Arial", value: "Arial" },
  { label: "Helvetica", value: "Helvetica" },
  { label: "Times New Roman", value: "Times" },
  { label: "Garamond", value: "Garamond" },
  { label: "Georgia", value: "Georgia" },
  { label: "Courier", value: "Courier" },
  { label: "Courier New", value: "Courier New" },
];

export function FontFamilySelect({
  editor,
  value,
}: {
  editor: Editor;
  value: string | undefined;
}) {
  const current = FONT_OPTIONS.some((o) => o.value === value) ? value : DEFAULT_FONT;

  return (
    <SimpleSelect
      aria-label="Font family"
      value={current}
      options={FONT_OPTIONS}
      className="h-8 w-36 shrink-0 shadow-none"
      onChange={(font) => {
        const chain = editor.chain().focus();
        if (font === DEFAULT_FONT) chain.unsetFontFamily().run();
        else chain.setFontFamily(font).run();
      }}
    />
  );
}
