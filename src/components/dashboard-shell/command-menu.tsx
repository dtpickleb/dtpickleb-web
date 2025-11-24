"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const items = [
  { label: "My Dashboard", href: "/dashboard/home" },
  { label: "All Tournaments", href: "/tournaments" },
  // { label: "Organize Tournament", href: "/tournament" },
  { label: "My Tournaments", href: "/tournaments/my" },
  { label: "My Registrations", href: "/tournaments/my" },
  { label: "My Invintations", href: "/tournaments/my" },
  { label: "My Matches", href: "/tournaments/my" },
];

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")
        setOpen((v) => !v);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex h-9 w-48 lg:w-64 items-center gap-2 rounded-xl border px-3 text-sm text-muted-foreground hover:bg-muted/50"
        aria-label="Open command palette"
      >
        <Search className="size-4" />
        <span className="truncate">Search...</span>
        <kbd className="ml-auto text-xs">⌘K</kbd>
      </button>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden rounded-xl border px-2 py-2 text-sm hover:bg-muted"
        aria-label="Open command palette"
      >
        ⌘K
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Jump to..." />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {items.map((i) => (
              <CommandItem
                key={i.href}
                onSelect={() => {
                  router.push(i.href);
                  setOpen(false);
                }}
              >
                {i.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
