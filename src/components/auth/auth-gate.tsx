"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthed } from "@/lib/auth-storage";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthed()) {
      // preserve the path so we can come back after login
      const next = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/sign-in?next=${next}`);
    } else {
      setReady(true);
    }
  }, [router, pathname]);

  if (!ready) return null; // or a skeleton
  return <>{children}</>;
}
