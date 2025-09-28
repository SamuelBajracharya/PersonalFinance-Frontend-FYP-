import {create} from "zustand";
import {  ViewportState } from "@/types/viewport";

// store to take viewport as desktop or mobile
export const useViewport = create<ViewportState>((set) => ({
    viewport: "desktop" as const, //default desktop
    setViewport: (viewport) => set({viewport}) //function to set viewport
}))