import { ReactNode } from "react";
import ResponsiveLayoutWrapper from "./ResponsiveLayoutWrapper";
import { Poppins } from "next/font/google";
import "../styles/globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { AntdMessageProvider } from "@/components/gloabalComponents/AntdMessageContext";

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
        {/* Prevent theme flicker: set data-theme before CSS loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = window.localStorage.getItem('theme-mode');
                if (t) {
                  var parsed = JSON.parse(t);
                  var resolvedTheme =
                    (parsed && parsed.state && parsed.state.theme) || parsed;
                  if (resolvedTheme === 'dark' || resolvedTheme === 'light') {
                    document.documentElement.dataset.theme = resolvedTheme;
                  }
                }
              } catch(e) {}
            `,
          }}
        />
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

      <body className={`${poppins.className} bg-mainBG text-textmain theme-transition`}>
        <AntdMessageProvider>
          <ThemeProvider>
            <AuthProvider>
              <QueryProvider>
                <ResponsiveLayoutWrapper>{children}</ResponsiveLayoutWrapper>
              </QueryProvider>
            </AuthProvider>
          </ThemeProvider>
        </AntdMessageProvider>
      </body>
    </html>
  );
}
