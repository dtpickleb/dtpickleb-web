// "Smart" fetch that prefers real API, but can fall back to mock data.
// Use: apiGet(url, { headers }, () => mockObject)

export const USE_DUMMY =
  typeof window !== "undefined" &&
  ["1", "true", "yes"].includes(String(process.env.NEXT_PUBLIC_USE_DUMMY || "").toLowerCase());

export async function apiGet<T>(
  url: string,
  init: RequestInit | undefined,
  mock: () => T | Promise<T>
): Promise<T> {
  if (USE_DUMMY) return await mock();
  try {
    const res = await fetch(url, init);
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as T;
  } catch {
    // fall back if API is not ready
    return await mock();
  }
}

export async function apiPost<T>(
  url: string,
  body: any,
  init: RequestInit | undefined,
  mock: () => T | Promise<T>
): Promise<T> {
  if (USE_DUMMY) return await mock();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      body: JSON.stringify(body),
      ...init,
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as T;
  } catch {
    return await mock();
  }
}

// Small helpers for UI derivations (server should send these eventually)
export function computeIsRegistrationOpen(open?: string | null, close?: string | null) {
  const now = Date.now();
  const s = open ? Date.parse(open) : -Infinity;
  const e = close ? Date.parse(close) : Infinity;
  return now >= s && now <= e;
}
export function computeIsCompleted(end?: string | null) {
  return !!end && Date.now() > Date.parse(end);
}
