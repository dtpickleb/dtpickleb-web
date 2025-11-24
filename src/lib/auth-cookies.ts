"use client";

export interface StoredAuth {
  token: string;
  expAt: number;
}

const AUTH_COOKIE_NAME = "pickle.auth";
const COOKIE_OPTIONS = {
  httpOnly: false, // Allow client-side access for API calls
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

// Client-side cookie utilities
export function saveAuthClient(token: string, expiresInSec: number): void {
  if (typeof window === "undefined") return;

  const expAt = Date.now() + expiresInSec * 1000;
  const payload: StoredAuth = { token, expAt };
  const expires = new Date(expAt);

  document.cookie = `${AUTH_COOKIE_NAME}=${JSON.stringify(payload)}; expires=${expires.toUTCString()}; path=/; ${COOKIE_OPTIONS.secure ? 'secure;' : ''} samesite=${COOKIE_OPTIONS.sameSite}`;
}

export function getAuthClient(): StoredAuth | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie =>
    cookie.trim().startsWith(`${AUTH_COOKIE_NAME}=`)
  );

  if (!authCookie) return null;

  try {
    const value = authCookie.split('=')[1];
    const parsed: StoredAuth = JSON.parse(decodeURIComponent(value));

    if (!parsed.token || !parsed.expAt) return null;
    if (Date.now() >= parsed.expAt) {
      clearAuthClient();
      return null;
    }

    return parsed;
  } catch {
    clearAuthClient();
    return null;
  }
}

export function clearAuthClient(): void {
  if (typeof window === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function isAuthedClient(): boolean {
  return !!getAuthClient();
}

export function authHeaderClient(): Record<string, string> {
  const auth = getAuthClient();
  return auth ? { Authorization: `Bearer ${auth.token}` } : {};
}