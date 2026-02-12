import { create } from "zustand";

interface ProfileOverlaysState {
  // Overlay states
  isUnlinkAccountConfirmationOpen: boolean;
  isDeleteDataConfirmationOpen: boolean;
  isLogoutConfirmationOpen: boolean;

  // Open functions
  openUnlinkAccountConfirmation: () => void;
  openDeleteDataConfirmation: () => void;
  openLogoutConfirmation: () => void;

  // Close functions
  closeUnlinkAccountConfirmation: () => void;
  closeDeleteDataConfirmation: () => void;
  closeLogoutConfirmation: () => void;

  // Optional: toggle functions
  toggleUnlinkAccountConfirmation: () => void;
  toggleDeleteDataConfirmation: () => void;
  toggleLogoutConfirmation: () => void;
}

export const useProfileOverlays = create<ProfileOverlaysState>((set) => ({
  // Initial states
  isUnlinkAccountConfirmationOpen: false,
  isDeleteDataConfirmationOpen: false,
  isLogoutConfirmationOpen: false,

  // Open
  openUnlinkAccountConfirmation: () =>
    set({ isUnlinkAccountConfirmationOpen: true }),
  openDeleteDataConfirmation: () => set({ isDeleteDataConfirmationOpen: true }),
  openLogoutConfirmation: () => set({ isLogoutConfirmationOpen: true }),

  // Close
  closeUnlinkAccountConfirmation: () =>
    set({ isUnlinkAccountConfirmationOpen: false }),
  closeDeleteDataConfirmation: () =>
    set({ isDeleteDataConfirmationOpen: false }),
  closeLogoutConfirmation: () => set({ isLogoutConfirmationOpen: false }),

  // Toggle
  toggleUnlinkAccountConfirmation: () =>
    set((state) => ({
      isUnlinkAccountConfirmationOpen: !state.isUnlinkAccountConfirmationOpen,
    })),
  toggleDeleteDataConfirmation: () =>
    set((state) => ({
      isDeleteDataConfirmationOpen: !state.isDeleteDataConfirmationOpen,
    })),
  toggleLogoutConfirmation: () =>
    set((state) => ({
      isLogoutConfirmationOpen: !state.isLogoutConfirmationOpen,
    })),
}));
