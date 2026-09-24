"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input, Label } from "./input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  /** The user must type this exactly to enable the destructive action. */
  confirmText: string;
  itemName?: string;
};

export default function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  itemName,
}: Props) {
  const [typed, setTyped] = useState("");
  const matches = typed === confirmText;

  const close = () => {
    setTyped("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {itemName && (
          <p className="rounded-lg bg-muted px-3 py-2 text-sm font-medium">
            &ldquo;{itemName}&rdquo;
          </p>
        )}
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!matches) return;
            onConfirm();
            close();
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm-delete">
              Type <span className="font-mono text-destructive">{confirmText}</span> to confirm
            </Label>
            <Input
              id="confirm-delete"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={!matches}>
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
