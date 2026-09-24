"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { deleteCookie } from "cookies-next";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmDeleteDialog from "@/components/ui/ConfirmDeleteDialog";
import { auth } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore from "@/zustand/useProfileStore";

export default function DangerZoneCard() {
  const router = useRouter();
  const deleteAccount = useProfileStore((s) => s.deleteAccount);
  const clearAuthDetails = useAuthStore((s) => s.clearAuthDetails);
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    setOpen(false);
    try {
      await deleteAccount();

      // Delete the auth cookie before Firebase sign-out so the proxy can't see a stale session.
      const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || "authToken";
      deleteCookie(cookieName, { path: "/" });

      await signOut(auth);
      clearAuthDetails();
      sessionStorage.clear();

      toast.success("Account deleted successfully.");
      router.replace("/");
    } catch (error) {
      console.error("Error on deletion of account:", error);
      toast.error("Couldn't delete your account. Please try again.");
    }
  };

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="font-serif text-lg text-destructive">Danger zone</CardTitle>
        <CardDescription>
          Permanently delete your account and profile, including any remaining credits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete account
        </Button>
      </CardContent>
      <ConfirmDeleteDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        title="Delete your account?"
        description="This can't be undone. All of your data will be permanently removed."
        confirmText="DELETE ACCOUNT"
      />
    </Card>
  );
}
