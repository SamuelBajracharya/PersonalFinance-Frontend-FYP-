"use client";

import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";

// Layouts
import AuthLayout from "@/layouts/AuthLayout";
import DesktopLayout from "@/layouts/DesktopLayout";
import MobileLayout from "@/layouts/MobileLayout";
import GeneralLayout from "@/layouts/GeneralLayout";

interface ResponsiveLayoutWrapperProps {
  children: ReactNode;
}

const ResponsiveLayoutWrapper = ({
  children,
}: ResponsiveLayoutWrapperProps) => {
  const pathname = usePathname();
  const { isMobile, isDesktop } = useResponsive();

  // Memoize layout detection for stability
  const detectedType = useMemo(() => {
    if (pathname === "/") return "general";
    if (pathname.startsWith("/auth")) return "auth";
    if (pathname.startsWith("/onboarding")) return "onboarding";
    if (pathname.startsWith("/success")) return "success";
    if (pathname === "/404" || pathname.startsWith("/not-found"))
      return "not-found";
    return "default";
  }, [pathname]);

  switch (detectedType) {
    case "auth":
      return <AuthLayout>{children}</AuthLayout>;

    case "onboarding":
    case "success":
    case "not-found":
    case "general":
      return <GeneralLayout>{children}</GeneralLayout>;

    case "default":
    default:
      return (
        <>
          {isDesktop && <DesktopLayout>{children}</DesktopLayout>}
          {isMobile && <MobileLayout>{children}</MobileLayout>}
        </>
      );
  }
};

export default ResponsiveLayoutWrapper;
