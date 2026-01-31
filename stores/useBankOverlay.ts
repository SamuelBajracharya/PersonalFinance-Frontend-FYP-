import { create } from "zustand";

interface BankOverlayState {
  isOpen: boolean;
  isBankLinked: boolean;
  open: () => void;
  close: () => void;
  initialize: () => void;
  setBankLinked: (value: boolean) => void;
}

export const useBankOverlay = create<BankOverlayState>((set) => ({
  isOpen: false,
  isBankLinked: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  initialize: () => {
    const linked = localStorage.getItem("isBankLinked") === "true";
    set({ isBankLinked: linked });
  },

  setBankLinked: (value: boolean) => {
    localStorage.setItem("isBankLinked", String(value));
    set({ isBankLinked: value });
  },
}));
