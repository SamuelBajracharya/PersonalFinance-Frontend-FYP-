"use client";

import { useResponsive } from '@/hooks/useResponsive';
import AuthLayout from '@/layouts/AuthLayout';
import DesktopLayout from '@/layouts/DesktopLayout';
import MobileLayout from '@/layouts/MobileLayout';
import React, { ReactNode } from 'react'


interface ResponsiveLayoutWrapperProps {
    children: ReactNode;
    type?: "auth" | "default";
}


const ResponsiveLayoutWrapper = ({ children, type = "default" }: ResponsiveLayoutWrapperProps) => {
    // checks if its mobile or desktop
    const { isMobile, isDesktop } = useResponsive();

    //use auth layout if its type of auth
    if (type === "auth") {
        return (
            <AuthLayout>{children}</AuthLayout>
        );
    }

    //uses default layouts when its default
    return (
        <>
            {/* destop layout */}
            {isDesktop && <DesktopLayout>{children}</DesktopLayout>}
            {/* mobile layout */}
            {isMobile && <MobileLayout>{children}</MobileLayout>}
        </>
    );
}

export default ResponsiveLayoutWrapper
