import { create } from "zustand";

interface BankOverlayState {
  isOpen: boolean;
  isBankLinked: boolean;
  isInitialized: boolean;
  open: () => void;
  close: () => void;
  initialize: () => void;
  setBankLinked: (value: boolean) => void;
}

export const useBankOverlay = create<BankOverlayState>((set) => ({
  isOpen: false,
  isBankLinked: false,
  isInitialized: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  initialize: () => {
    const linked = localStorage.getItem("isBankLinked") === "true";
    set({ isBankLinked: linked, isInitialized: true });
  },

  setBankLinked: (value: boolean) => {
    localStorage.setItem("isBankLinked", String(value));
    set({ isBankLinked: value });
  },
}));
