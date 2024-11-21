import { create } from 'zustand'

interface MobileMenuState {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  toggleMenu: () => void
}

export const useMobileMenuStore = create<MobileMenuState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
}))