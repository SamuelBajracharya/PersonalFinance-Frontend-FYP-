"use client";

import { ReactNode, useEffect } from "react";
import { useThemeStore } from "@/stores/useThemeStore";

interface ThemeProviderProps {
    children: ReactNode;
}

// Set theme synchronously on first load to prevent flicker
if (typeof window !== "undefined") {
    const storedTheme = window.localStorage.getItem("theme-mode");
    if (storedTheme) {
        try {
            const parsed = JSON.parse(storedTheme);
            const resolvedTheme =
                (parsed && parsed.state && parsed.state.theme) || parsed;
            if (resolvedTheme === "dark" || resolvedTheme === "light") {
                document.documentElement.dataset.theme = resolvedTheme;
            }
        } catch { }
    }
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
    const theme = useThemeStore((state) => state.theme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    return <>{children}</>;
}
