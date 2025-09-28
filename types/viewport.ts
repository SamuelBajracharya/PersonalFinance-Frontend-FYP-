import { ReactNode } from "react";

// type of viewport
export type ViewportType = "mobile" | "desktop";

// interface for the viewport store
export interface ViewportState {
    viewport: ViewportType;
    setViewport: (viewport: ViewportType) => void;
}

//interface for layout that requires children prop
export interface LayoutPropsType {
    children: ReactNode
}