import { useThemeStore } from "../../stores/useThemeStore";

export function useSidebarIconColor(isActive: boolean) {
    // Use Zustand store for reactivity
    const theme = useThemeStore((state) => state.theme);

    if (theme === "light") {
        // Light mode: active icon is white, inactive is black
        return isActive ? "#ffffff" : "#0f1724";
    } else {
        // Dark mode: all icons are white
        return "#fefefe";
    }
}
