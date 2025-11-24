import { cookies } from "next/headers";
import type { StoredAuth } from "./auth-cookies";

const AUTH_COOKIE_NAME = "pickle.auth";

export async function getAuthServer(): Promise<StoredAuth | null> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

    if (!authCookie?.value) return null;

    const parsed: StoredAuth = JSON.parse(authCookie.value);
    if (!parsed.token || !parsed.expAt) return null;
    if (Date.now() >= parsed.expAt) return null;

    return parsed;
  } catch {
    return null;
  }
}

export async function isAuthedServer(): Promise<boolean> {
  const auth = await getAuthServer();
  return !!auth;
}

export async function authHeaderServer(): Promise<Record<string, string>> {
  const auth = await getAuthServer();
  return auth ? { Authorization: `Bearer ${auth.token}` } : {};
}
