export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
if (!API_URL && typeof window !== "undefined") {
  // Non-fatal: you’ll just see 404s if you forget to set the env
  console.warn("NEXT_PUBLIC_API_URL is missing");
}
