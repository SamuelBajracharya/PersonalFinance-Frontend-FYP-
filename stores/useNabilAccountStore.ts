import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NabilAccountStore {
    nabilAccountId: string | null;
    setNabilAccountId: (accountId: string | null) => void;
    clearNabilAccountId: () => void;
}

export const useNabilAccountStore = create<NabilAccountStore>()(
    persist(
        (set) => ({
            nabilAccountId: null,
            setNabilAccountId: (accountId) => set({ nabilAccountId: accountId }),
            clearNabilAccountId: () => set({ nabilAccountId: null }),
        }),
        {
            name: "nabil-account-store",
            partialize: (state) => ({ nabilAccountId: state.nabilAccountId }),
        },
    ),
);
