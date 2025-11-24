import { NextRequest, NextResponse } from "next/server";

interface StoredAuth {
  token: string;
  expAt: number;
}

const AUTH_COOKIE_NAME = "pickle.auth";

const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up", "/about", "/contact"];

function isValidAuth(authData: StoredAuth): boolean {
  return !!(authData.token && authData.expAt && Date.now() < authData.expAt);
}

function getAuthFromCookie(request: NextRequest): StoredAuth | null {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
  if (!authCookie?.value) return null;

  try {
    const parsed: StoredAuth = JSON.parse(authCookie.value);
    if (!isValidAuth(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const auth = getAuthFromCookie(request);

  if (!auth) {
    const next = encodeURIComponent(pathname);
    const url = new URL(`/sign-in?next=${next}`, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
