import { create } from "zustand";

interface AuthDialogState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useAuthDialogStore = create<AuthDialogState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
