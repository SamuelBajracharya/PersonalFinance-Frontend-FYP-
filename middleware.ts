// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_API_BASE =
  process.env.NEXT_PUBLIC_AUTH_API_BASE_URL || "http://127.0.0.1:8000/api/v1/auth";

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";

const PUBLIC_EXACT_PATHS = new Set([
  "/",
  "/404",
  "/not-found",
  "/auth/login",
  "/auth/register",
]);

const PUBLIC_PREFIXES = ["/auth", "/onboarding", "/success"];
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/analytics",
  "/transactions",
  "/budgetgoals",
  "/ai-assistant",
  "/coupons",
  "/rewards",
  "/profile",
  "/help",
  "/achievements",
  "/mystocks",
];

const isKnownPath = (pathname: string): boolean => {
  if (PUBLIC_EXACT_PATHS.has(pathname)) return true;
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix)))
    return true;
  return false;
};

const normalizeToken = (value?: string): string | undefined => {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const isTokenExpired = (token?: string): boolean => {
  if (!token) return true;

  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;

  // 10s buffer to avoid race conditions close to expiry.
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now + 10;
};

const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await fetch(`${AUTH_API_BASE}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      access_token?: string;
      refresh_token?: string;
    };

    if (!data.access_token) return null;
    return data;
  } catch {
    // Avoid hard failures when auth API is temporarily unavailable.
    return null;
  }
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = normalizeToken(req.cookies.get(ACCESS_COOKIE)?.value);
  const refreshToken = normalizeToken(req.cookies.get(REFRESH_COOKIE)?.value);

  // Always normalize unknown URLs to the dedicated 404 route.
  if (!isKnownPath(pathname)) {
    return NextResponse.redirect(new URL("/404", req.url));
  }

  const isAuthPage = pathname === "/auth/login" || pathname === "/auth/register";
  const isPublicPage = pathname === "/" || pathname === "/404";

  // Keep public non-auth pages accessible.
  if (isPublicPage) {
    return NextResponse.next();
  }

  // Auth pages: if already authenticated (or refreshable), skip login/register.
  if (isAuthPage) {
    if (accessToken && !isTokenExpired(accessToken)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (refreshToken) {
      const refreshed = await refreshAccessToken(refreshToken);
      if (refreshed?.access_token) {
        const res = NextResponse.redirect(new URL("/dashboard", req.url));
        res.cookies.set(ACCESS_COOKIE, refreshed.access_token, {
          path: "/",
          httpOnly: false,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60,
        });

        if (refreshed.refresh_token) {
          res.cookies.set(REFRESH_COOKIE, refreshed.refresh_token, {
            path: "/",
            httpOnly: false,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
          });
        }

        return res;
      }
    }

    return NextResponse.next();
  }

  // Other /auth routes (verify/reset flows) stay accessible.
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Protected pages: valid access token means pass through.
  if (accessToken && !isTokenExpired(accessToken)) {
    return NextResponse.next();
  }

  // Access token missing/expired: try refresh token.
  if (refreshToken) {
    const refreshed = await refreshAccessToken(refreshToken);
    if (refreshed?.access_token) {
      const res = NextResponse.next();
      res.cookies.set(ACCESS_COOKIE, refreshed.access_token, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60,
      });

      if (refreshed.refresh_token) {
        res.cookies.set(REFRESH_COOKIE, refreshed.refresh_token, {
          path: "/",
          httpOnly: false,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      return res;
    }
  }

  // No usable tokens: force login and clear stale cookies.
  const redirectRes = NextResponse.redirect(new URL("/auth/login", req.url));
  redirectRes.cookies.delete(ACCESS_COOKIE);
  redirectRes.cookies.delete(REFRESH_COOKIE);
  redirectRes.cookies.delete("bank_token");
  return redirectRes;
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|robots.txt|sitemap.xml|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.gif|.*\\.webp|.*\\.ico).*)",
  ],
};
