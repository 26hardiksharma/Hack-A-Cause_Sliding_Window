import { NextRequest, NextResponse } from "next/server";
import {
  ENABLE_AUTH,
  AUTH_COOKIE,
  PUBLIC_ROUTES,
  LOGIN_REDIRECT,
} from "@/lib/auth-config";

export function middleware(request: NextRequest) {
  // If auth is disabled globally, let every request through.
  if (!ENABLE_AUTH) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Always allow public auth routes and Next.js internals.
  const isPublic =
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".");

  if (isPublic) {
    return NextResponse.next();
  }

  // Check for a session token in cookies.
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (!token) {
    const loginUrl = new URL(LOGIN_REDIRECT, request.url);
    // Preserve the original destination so we can redirect back after login.
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on every route except static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
