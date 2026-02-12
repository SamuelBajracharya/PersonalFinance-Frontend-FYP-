import { ReactNode } from "react";
import ResponsiveLayoutWrapper from "./ResponsiveLayoutWrapper";
import { Poppins } from "next/font/google";
import "../styles/globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import AuthProvider from "@/components/providers/AuthProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="application-name" content="SaveMarga" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="SaveMarga" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" href="/icons/icon-192.png" />
        <title>SaveMarga</title>
      </head>

      <body className={`${poppins.className} bg-mainBG text-textmain`}>
        <AuthProvider>
          <QueryProvider>
            <ResponsiveLayoutWrapper>{children}</ResponsiveLayoutWrapper>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
