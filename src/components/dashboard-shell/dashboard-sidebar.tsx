"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Trophy, CalendarCheck,
  Mail,
  Swords
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarUser } from "@/components/dashboard-shell/sidebar-user";
import { usePlayerProfile } from "@/app/features/registration/usePlayerProfile";

const NAV = [
  { href: "/dashboard/home", label: "My Dashboard", icon: LayoutDashboard },
  { href: "/tournaments", label: "All Tournaments", icon: Trophy },
  // {
  //   href: "/tournament",
  //   label: "Organize Tournament",
  //   icon: CalendarPlus,
  // },
  {
    href: "/my-tournaments",
    label: "My Tournaments",
    icon: Trophy,
  },

  {
    label: "My Registrations",
    href: "/tournament/my-registrations",
    icon: CalendarCheck,
  },
  {
    label: "My Invintations",
    href: "/tournament/my-invitations",
    icon: Mail,
  },
  { label: "My Matches", href: "/tournaments/my-matches", icon: Swords },
];

export function AppDashboardSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { profile } = usePlayerProfile();

  const displayName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : "Player";
  const displayEmail = profile?.email || "you@example.com";

  return (
    <Sidebar collapsible="icon" className="bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="px-1 py-3">
        {state === "collapsed" ? (
          <div className="text-3xl" aria-label="DT Pickleball">
            🥒
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-3xl">🥒</span>
            <div>
              <Link href="/dashboard/home">
                <div className="text-lg font-semibold mt-1 leading-tight">
                  DT Pickleball
                </div>
              </Link>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => {
                const Icon = item.icon;
                // Check exact match first, or startsWith but only if no other nav item is a better match
                const active = pathname === item.href ||
                  (pathname?.startsWith(item.href) &&
                    !NAV.some(nav => nav.href !== item.href &&
                      nav.href.length > item.href.length &&
                      pathname?.startsWith(nav.href)));
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="
                        data-[active=true]:bg-sidebar-accent
                        data-[active=true]:text-sidebar-primary
                        data-[active=true]:ring-1
                        data-[active=true]:ring-sidebar-ring
                        focus-visible:ring-2 focus-visible:ring-primary
                      "
                    >
                      <Link href={item.href}>
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarUser name={displayName} email={displayEmail} />
      </SidebarFooter>
    </Sidebar>
  );
}
