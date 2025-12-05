// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes
  if (pathname === "/" || pathname.startsWith("/auth") || pathname === "/404") {
    return NextResponse.next();
  }

  // Check token
  const token = req.cookies.get("accessToken")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|robots.txt|sitemap.xml|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.gif|.*\\.webp|.*\\.ico).*)",
  ],
};
