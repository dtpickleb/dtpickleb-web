"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearAuthClient } from "@/lib/auth-cookies";
import { useRouter } from "next/navigation";
import {
  Settings,
  CreditCard,
  Bell,
  LogOut,
  Sparkles,
  UserPen,
  MessageCircleQuestionMark,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useAppDispatch } from "@/store/hooks";
import { clearProfile } from "@/app/features/registration/playerProfileSlice";

const USER_NAV = [
  {
    label: "Upgrade to Pro",
    href: "/dashboard/upgrade",
    icon: Sparkles,
  },
  {
    label: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
    separator: true,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserPen,
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    label: "Help & Feedback",
    href: "/dashboard/help",
    icon: MessageCircleQuestionMark,
    separator: true,
  },
  {
    label: "Log out",
    href: "/sign-in",
    icon: LogOut,
    isLogout: true,
  },
];

export function SidebarUser({
  name = "Player",
  email = "you@example.com",
}: {
  name?: string;
  email?: string;
}) {
  const router = useRouter();
  const { state } = useSidebar();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    clearAuthClient();
    dispatch(clearProfile());
    router.replace("/sign-in");
  };

  if (state === "collapsed") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex w-full items-center justify-center p-2"
            aria-label="Open user menu"
          >
            <Avatar className="size-8 rounded-lg">
              <AvatarImage alt={name} />
              <AvatarFallback className="rounded-lg">
                {name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="top"
          align="start"
          className="w-57 rounded-xl bg-sidebar"
        >
          <DropdownMenuLabel className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left">
            <Avatar className="size-8 rounded-md">
              <AvatarImage alt={name} />
              <AvatarFallback className="rounded-lg">
                {name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{name}</div>
              <div className="truncate text-xs text-muted-foreground">
                {email}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {USER_NAV.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label}>
                  <DropdownMenuItem
                    onClick={
                      item.isLogout
                        ? handleLogout
                        : () => router.push(item.href)
                    }
                  >
                    <Icon className="mr-2 size-4" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                  {item.separator && <DropdownMenuSeparator />}
                </div>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left hover:bg-muted focus:outline-none"
          aria-label="Open user menu"
        >
          <Avatar className="size-8 rounded-lg">
            <AvatarImage alt={name} />
            <AvatarFallback className="rounded-lg">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{name}</div>
            <div className="truncate text-xs text-muted-foreground">
              {email}
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="start"
        className="w-57 rounded-xl bg-sidebar"
      >
        <DropdownMenuLabel className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left">
          <Avatar className="size-8 rounded-lg">
            <AvatarImage alt={name} />
            <AvatarFallback className="rounded-lg">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{name}</div>
            <div className="truncate text-xs text-muted-foreground">
              {email}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {USER_NAV.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label}>
                <DropdownMenuItem
                  onClick={
                    item.isLogout ? handleLogout : () => router.push(item.href)
                  }
                >
                  <Icon className="mr-2 size-4" />
                  <span>{item.label}</span>
                </DropdownMenuItem>
                {item.separator && <DropdownMenuSeparator />}
              </div>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
