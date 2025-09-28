import { ReactNode } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import AuthLayout from "@/layouts/AuthLayout";
import DesktopLayout from "@/layouts/DesktopLayout";
import MobileLayout from "@/layouts/MobileLayout";

// interface for props
interface RootLayoutProps {
  children: ReactNode;
  type?: "auth" | "default"; 
}

export default function RootLayout({ children, type = "default" }: RootLayoutProps) {
  // checks if its mobile or desktop
  const { isMobile, isDesktop } = useResponsive();

  //use auth layout if its type of auth
  if (type === "auth") {
    return (
      <html lang="en">
        <body>
          <AuthLayout>{children}</AuthLayout>
        </body>
      </html>
    );
  }

  //uses default layouts when its default
  return (
    <html lang="en">
      <body>
        {/* destop layout */}
        {isDesktop && <DesktopLayout>{children}</DesktopLayout>}
        {/* mobile layout */}
        {isMobile && <MobileLayout>{children}</MobileLayout>}
      </body>
    </html>
  );
}
