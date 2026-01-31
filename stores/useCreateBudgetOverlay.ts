import { create } from "zustand";

interface CreateBudgetOverlayState {
  isCreateBudgetOpen: boolean;
  openCreateBudget: () => void;
  closeCreateBudget: () => void;
}

export const useCreateBudgetOverlay = create<CreateBudgetOverlayState>(
  (set) => ({
    isCreateBudgetOpen: false,
    openCreateBudget: () => set({ isCreateBudgetOpen: true }),
    closeCreateBudget: () => set({ isCreateBudgetOpen: false }),
  }),
);
