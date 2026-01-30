"use client";

import { create } from "zustand";

interface LinkAccountOverlayState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useBankOverlay = create<LinkAccountOverlayState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
