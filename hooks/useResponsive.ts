"use client"

import { useViewport } from "@/stores/useViewport";
import { useEffect } from "react";

export const useResponsive = (mobileBreakpoint = 768) => {
    // use the zustand store
    const { viewport, setViewport } = useViewport();

    useEffect(() => {
        const checkViewport = () => {
            const newViewport = window.innerWidth < mobileBreakpoint ? "mobile" : "desktop";
            // change the viewport if its not the same
            if (newViewport !== viewport) {
                setViewport(newViewport);
            }
        };

        // Check on mount
        checkViewport();

        // Listen to window resize
        window.addEventListener("resize", checkViewport);

        // reset the event listener
        return () => window.removeEventListener("resize", checkViewport);
    }, [viewport, setViewport, mobileBreakpoint]);
    //   sets the boolean value for later use
    const isMobile = viewport === "mobile";
    const isDesktop = !isMobile; // explicitly mutually exclusive

    return { viewport, isMobile, isDesktop };
};
