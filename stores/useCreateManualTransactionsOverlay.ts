import { create } from "zustand";

interface CreateManualTransactionsOverlayState {
    createManualTransactions: boolean;
    openCreateManualTransactions: () => void;
    closeCreateManualTransactions: () => void;
}

export const useCreateManualTransactionsOverlay = create<CreateManualTransactionsOverlayState>((set) => ({
    createManualTransactions: false,
    openCreateManualTransactions: () => set({ createManualTransactions: true }),
    closeCreateManualTransactions: () => set({ createManualTransactions: false }),
}));
