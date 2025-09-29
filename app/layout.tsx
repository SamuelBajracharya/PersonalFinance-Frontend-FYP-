import { ReactNode } from "react";
import ResponsiveLayoutWrapper from "./ResponsiveLayoutWrapper";
import { Poppins } from "next/font/google";
import "../styles/globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // pick the weights you need
  variable: "--font-poppins", // CSS variable name
});

// interface for props
interface RootLayoutProps {
  children: ReactNode;
  type?: "auth" | "default";
}

export default function RootLayout({ children, type = "default" }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-mainBG text-textmain`}>
        {/* Client wrapper handles responsive layouts */}
        <ResponsiveLayoutWrapper type={type}>{children}</ResponsiveLayoutWrapper>
      </body>
    </html>
  )

}
