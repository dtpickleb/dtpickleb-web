"use client";
import { Button } from "@/components/ui/button";
import { clearAuthClient } from "@/lib/auth-cookies";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={() => {
        clearAuthClient();
        router.replace("/sign-in");
      }}
    >
      Sign out
    </Button>
  );
}
