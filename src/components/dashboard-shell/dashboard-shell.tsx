"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CommandMenu } from "@/components/dashboard-shell/command-menu";
import { AppDashboardSidebar } from "@/components/dashboard-shell/dashboard-sidebar";
import { DashboardBreadcrumbs } from "@/components/dashboard-shell/breadcrumbs";
import { useRouter } from "next/navigation";
import { Bell, Copy, Check } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { useState } from "react";
// import { useInitializeEnums } from "@/store/hooks";

export function AppDashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const playerProfile = useSelector((state: RootState) => state.playerProfile.profile);
  const memberId = playerProfile?.memberId;

  // TODO: Re-enable after backend caching is implemented
  // Initialize enums when dashboard loads (user is authenticated)
  // useInitializeEnums();

  const handleCopyMemberId = async () => {
    if (memberId) {
      try {
        await navigator.clipboard.writeText(memberId);
        setCopied(true);
        toast.success("Member ID copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error(err);
        toast.error("Failed to copy Member ID");
      }
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppDashboardSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b px-3 backdrop-blur lg:px-4 bg-sidebar">
            <SidebarTrigger />

            <div className="ml-1 hidden md:block">
              <DashboardBreadcrumbs />
            </div>

            <div className="ml-auto flex items-center gap-2">
              {memberId && (
                <button
                  onClick={handleCopyMemberId}
                  className="inline-flex h-9 items-center gap-1.5 px-3 rounded-xl border hover:bg-muted transition-colors text-sm font-medium"
                  aria-label="Copy Member ID"
                  title="Click to copy Member ID"
                >
                  <span className="text-muted-foreground">ID:</span>
                  <span>{memberId}</span>
                  {copied ? (
                    <Check className="size-3.5 text-green-500" />
                  ) : (
                    <Copy className="size-3.5 opacity-50" />
                  )}
                </button>
              )}
              <button
                onClick={() => router.push("/dashboard/notifications")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-0 hover:bg-muted"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
              </button>
              <CommandMenu />
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 px-4 py-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
