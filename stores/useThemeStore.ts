import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeMode = "dark" | "light";

interface ThemeStore {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            theme: "dark",
            setTheme: (theme) => set({ theme }),
            toggleTheme: () =>
                set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
        }),
        {
            name: "theme-mode",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
