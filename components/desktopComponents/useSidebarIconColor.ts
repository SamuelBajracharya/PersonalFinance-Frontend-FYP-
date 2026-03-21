import { useThemeStore } from "../../stores/useThemeStore";

export function useSidebarIconColor(isActive: boolean) {
    // Get current theme from store
    const theme = typeof window !== "undefined" && window.localStorage.getItem("theme-mode")
        ? JSON.parse(window.localStorage.getItem("theme-mode")!)
        : "dark";

    if (theme === "light") {
        // Light mode: active icon is white, inactive is black
        return isActive ? "#ffffff" : "#0f1724";
    } else {
        // Dark mode: all icons are white
        return "#fefefe";
    }
}
