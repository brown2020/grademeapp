"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmDeleteDialog from "@/components/ui/ConfirmDeleteDialog";
import { signOutUser } from "@/lib/auth/signOut";
import useProfileStore from "@/zustand/useProfileStore";

export default function DangerZoneCard() {
  const router = useRouter();
  const deleteAccount = useProfileStore((s) => s.deleteAccount);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const onConfirm = async () => {
    setOpen(false);
    setDeleting(true);
    try {
      await deleteAccount();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Couldn't delete your account. Please try again.");
      setDeleting(false);
      return;
    }
    try {
      // The auth user is already gone server-side; this clears the local session.
      await signOutUser();
    } catch (error) {
      console.error("Error signing out after account deletion:", error);
    }
    toast.success("Your account and all of its data were deleted.");
    router.replace("/");
  };

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="font-serif text-lg text-destructive">Danger zone</CardTitle>
        <CardDescription>
          Permanently delete your account and all of its data: profile, credits, grading
          history, custom rubrics, payment records, plagiarism reports, and uploaded files.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" loading={deleting} onClick={() => setOpen(true)}>
          Delete account
        </Button>
      </CardContent>
      <ConfirmDeleteDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        title="Delete your account?"
        description="This can't be undone. Your profile, credits, grading history, custom rubrics, payment records, plagiarism reports, and uploaded files will be permanently removed."
        confirmText="DELETE ACCOUNT"
      />
    </Card>
  );
}
