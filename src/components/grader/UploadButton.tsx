"use client";

import { useRef } from "react";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ACCEPTED_UPLOAD_TYPES = ".docx,.pdf,.odt,.txt,.rtf";

/** Opens a file picker for a draft document (DOCX, PDF, ODT, RTF, TXT). */
export function UploadButton({
  uploading,
  onFile,
}: {
  uploading: boolean;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        loading={uploading}
        onClick={() => inputRef.current?.click()}
        title="Upload a DOCX, PDF, ODT, RTF or TXT file"
      >
        {!uploading && <Paperclip />}
        {uploading ? "Uploading…" : "Upload file"}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_UPLOAD_TYPES}
        className="sr-only"
        tabIndex={-1}
        aria-label="Upload a document"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </>
  );
}
