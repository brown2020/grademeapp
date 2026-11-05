"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { parseDocumentFromUrl } from "@/actions/parseDocumentFromUrl";
import { useRubricStore } from "@/zustand/useRubricStore";
import {
  UPLOAD_STALL_MS,
  storageObjectName,
  uploadContentType,
  uploadErrorMessage,
  waitForUpload,
  withDeadline,
  type UploadTaskLike,
} from "./uploadFile";

/** Matches the size limit in storage.rules. */
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const SLOW_STEP = "The upload took too long. Check your connection and try again.";

/**
 * Uploads a draft to Firebase Storage, parses its text server-side and loads
 * it (and a title from the file name) into the grader.
 */
export function useDocumentUpload(uid: string) {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const upload = async (file: File) => {
    if (!uid) {
      toast.error("Please log in to upload a file.");
      return false;
    }

    if (file.size >= MAX_UPLOAD_BYTES) {
      toast.error("That file is over 10 MB. Please upload a smaller document.");
      return false;
    }

    const contentType = uploadContentType(file.name, file.type);
    if (!contentType) {
      toast.error("Upload a DOCX, PDF, ODT, RTF or TXT file.");
      return false;
    }

    setUploading(true);
    const toastId = toast.loading("Uploading file...");
    try {
      const { setGradingData } = useRubricStore.getState();
      setGradingData({ title: file.name.split(".")[0] });

      // Bytes, not the File. A text File's MIME type often includes a charset,
      // which storage rules reject, and uploadBytes will retry that failure for
      // 10 minutes without aborting an XHR that never settles.
      const bytes = new Uint8Array(await file.arrayBuffer());
      const [{ getDownloadURL, ref, uploadBytesResumable }, { storage }] = await Promise.all([
        import("firebase/storage"),
        import("@/firebase/storage"),
      ]);
      if (!storage) throw new Error("Storage isn't available.");
      storage.maxUploadRetryTime = UPLOAD_STALL_MS;
      storage.maxOperationRetryTime = UPLOAD_STALL_MS;

      const fileRef = ref(storage, `uploads/${uid}/${storageObjectName(file.name)}`);
      const task = uploadBytesResumable(fileRef, bytes, { contentType });
      await waitForUpload(task as UploadTaskLike);
      const downloadURL = await withDeadline(getDownloadURL(fileRef), UPLOAD_STALL_MS, SLOW_STEP);
      setFileUrl(downloadURL);

      const parsedText = await withDeadline(parseDocumentFromUrl(downloadURL), UPLOAD_STALL_MS, SLOW_STEP);
      setGradingData({ text: parsedText });

      toast.success("File uploaded successfully.", { id: toastId });
      return true;
    } catch (error) {
      console.error("Failed to upload file:", error);
      toast.error(uploadErrorMessage(error), { id: toastId });
      return false;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, fileUrl, upload };
}
