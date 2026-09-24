"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import { htmlToDocx } from "@/actions/htmlToDocx";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function base64ToBlob(base64: string, type: string) {
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  return new Blob([bytes], { type });
}

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function safeFileName(name: string) {
  return name.trim().replace(/[\\/:*?"<>|]+/g, "").slice(0, 80) || "document";
}

type DownloadPopoverProps = {
  /** HTML content of the document to export. */
  content: string;
  fileName?: string;
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
};

export default function DownloadPopover({
  content,
  fileName = "document",
  label = "Download",
  variant = "secondary",
  size = "md",
  className,
}: DownloadPopoverProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const downloadDocx = async () => {
    setIsLoading(true);
    try {
      const base64 = await htmlToDocx(content);
      triggerDownload(base64ToBlob(base64, DOCX_MIME), `${safeFileName(fileName)}.docx`);
      setOpen(false);
    } catch (error) {
      console.error("Error generating document:", error);
      toast.error("Couldn't generate the document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={variant} size={size} className={className} disabled={!content}>
          <Download />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-2">
        <p className="px-2 pb-1.5 pt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Download as
        </p>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-3 px-2 py-2 text-left"
          onClick={downloadDocx}
          loading={isLoading}
        >
          {!isLoading && <FileText className="text-primary" />}
          <span className="flex flex-col">
            <span>Word document</span>
            <span className="text-xs font-normal text-muted-foreground">.docx</span>
          </span>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
