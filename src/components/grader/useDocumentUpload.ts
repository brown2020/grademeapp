"use client";

import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-hot-toast";
import { storage } from "@/firebase/firebaseClient";
import { parseDocumentFromUrl } from "@/actions/parseDocumentFromUrl";
import { useRubricStore } from "@/zustand/useRubricStore";

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

    setUploading(true);
    const toastId = toast.loading("Uploading file...");
    try {
      const { setGradingData } = useRubricStore.getState();
      setGradingData({ title: file.name.split(".")[0] });

      const fileRef = ref(storage, `uploads/${uid}/${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      setFileUrl(downloadURL);

      const parsedText = await parseDocumentFromUrl(downloadURL);
      setGradingData({ text: parsedText });

      toast.success("File uploaded successfully.", { id: toastId });
      return true;
    } catch (error) {
      console.error("Failed to upload file:", error);
      toast.error("Failed to upload file. Please try again.", { id: toastId });
      return false;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, fileUrl, upload };
}
