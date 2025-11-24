export const AUTH_PERSISTENCE: "session" | "local" = "session";

type StoredAuth = { token: string; expAt: number };

function getStore(): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  return AUTH_PERSISTENCE === "local"
    ? window.localStorage
    : window.sessionStorage;
}

const KEY = "pickle.auth";

export function saveAuth(token: string, expiresInSec: number) {
  const store = getStore();
  if (!store) return;
  const expAt = Date.now() + expiresInSec * 1000;
  const payload: StoredAuth = { token, expAt };
  store.setItem(KEY, JSON.stringify(payload));
}

export function getAuth(): StoredAuth | null {
  const store = getStore();
  if (!store) return null;
  const raw = store.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed: StoredAuth = JSON.parse(raw);
    if (!parsed.token || !parsed.expAt) return null;
    if (Date.now() >= parsed.expAt) {
      store.removeItem(KEY);
      return null;
    }
    return parsed;
  } catch {
    store.removeItem(KEY);
    return null;
  }
}

export function clearAuth() {
  const store = getStore();
  store?.removeItem(KEY);
}

export function authHeader(): HeadersInit {
  const a = getAuth();
  return a ? { Authorization: `Bearer ${a.token}` } : {};
}

export function isAuthed() {
  return !!getAuth();
}
