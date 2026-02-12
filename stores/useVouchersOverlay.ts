import { create } from "zustand";

interface VouchersOverlayState {
    isVoucherOverlayOpen: boolean;
    voucherId: string;
    openVoucherOverlay: (voucherId: string) => void;
    closeVoucherOverlay: () => void;
}

export const useVouchersOverlay = create<VouchersOverlayState>((set) => ({
    isVoucherOverlayOpen: false,
    voucherId: "",
    openVoucherOverlay: (voucherId: string) =>
        set({ isVoucherOverlayOpen: true, voucherId }),
    closeVoucherOverlay: () => set({ isVoucherOverlayOpen: false, voucherId: "" }),
}));
