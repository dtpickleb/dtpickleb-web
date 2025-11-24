"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Globe, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// --------------------------------

export type Option = {
  value: string | number;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
};

type RemoteFetcher = (args: { page: number; q: string }) => Promise<{
  options: Option[];
  hasMore: boolean;
}>;

type Props = {
  value?: string | number;
  onChange?: (value: string | number | undefined) => void;
  placeholder?: string;
  options?: Option[];              // ✅ still works for local mode
  emptyText?: string;
  className?: string;
  searchable?: boolean;

  // ✅ NEW: remote (server pagination) mode
  remote?: {
    fetchPage: RemoteFetcher;
    pageSize?: number;             // optional, informative only
    initialQuery?: string;
  };
};

export function Combobox({
  value,
  onChange,
  placeholder,
  options = [],
  emptyText = "No results",
  className,
  searchable = true,
  remote,
}: Props) {
  const [open, setOpen] = React.useState(false);

  // --- search state (debounced)
  const [query, setQuery] = React.useState(remote?.initialQuery ?? "");
  const debouncedQuery = useDebounced(query, 250);

  // --- remote pagination state
  const [page, setPage] = React.useState(1);
  const [items, setItems] = React.useState<Option[]>([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  const isRemote = !!remote;

  // Label for current value
  const display = React.useMemo(() => {
    const list = isRemote ? items : options;
    return list.find(o => o.value === value)?.label ?? "";
  }, [isRemote, items, options, value]);

  // Local filter if not remote
  const filteredLocal = React.useMemo(() => {
    if (isRemote || !searchable || !query) return options;
    return options.filter(o =>
      o.label.toLowerCase().includes(query.toLowerCase()) ||
      o.sublabel?.toLowerCase().includes(query.toLowerCase())
    );
  }, [isRemote, options, query, searchable]);

  // Initial load when opening (remote)
  React.useEffect(() => {
    if (!isRemote || !open) return;
    // Reset search when opening and load initial data
    if (items.length === 0 || query !== "") {
      setQuery("");
      void loadPage(1, "", false); // Use empty string for initial load
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isRemote]);

  // When debounced query changes in remote mode, reset + fetch page 1
  React.useEffect(() => {
    if (!isRemote) return;
    console.log("Debounced query changed:", debouncedQuery);
    setPage(1);
    setItems([]);
    setHasMore(true);
    if (open) void loadPage(1, debouncedQuery, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, isRemote]);

  // IntersectionObserver to fetch next page (remote)
  React.useEffect(() => {
    if (!isRemote || !open) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        void loadPage(page + 1, debouncedQuery, true);
      }
    }, { root: el.closest("[data-radix-command-list]") as Element | null });

    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRemote, open, page, hasMore, loading, debouncedQuery]);

  async function loadPage(nextPage: number, q: string, append: boolean) {
    if (!remote) return;
    try {
      setLoading(true);
      console.log("Combobox loadPage called with:", { nextPage, q, append });
      const res = await remote.fetchPage({ page: nextPage, q });
      console.log("Combobox loadPage result:", res);
      setItems(prev => (append ? [...prev, ...res.options] : res.options));
      setHasMore(res.hasMore);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  }

  const listToShow = isRemote ? items : filteredLocal;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate">{display || placeholder || "Select..."}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* Make content match trigger width via Radix CSS var */}
      <PopoverContent
        align="start"
        className="p-0 w-[var(--radix-popover-trigger-width)] bg-sidebar"
      >
        <Command shouldFilter={!isRemote}>
          {searchable && (
            <CommandInput
              placeholder="Search..."
              value={query}
              onValueChange={(v) => {
                console.log("Search input changed:", v);
                setQuery(v);
                // (remote search is triggered by debounced effect)
              }}
            />
          )}

          <CommandList className="max-h-64 overflow-auto">
            <CommandEmpty className="py-6 text-center">
              {loading ? "Loading..." : emptyText}
            </CommandEmpty>

            <CommandGroup>
              {listToShow.map((o) => (
                <CommandItem
                  key={String(o.value)}
                  value={String(o.value)}
                  onSelect={() => {
                    onChange?.(o.value);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === o.value ? "opacity-100" : "opacity-0")} />
                  {o.icon ?? <Globe className="mr-2 h-4 w-4 opacity-60" />}
                  <div className="truncate">
                    <div className="truncate">{o.label}</div>
                    {!!o.sublabel && <div className="text-muted-foreground text-xs">{o.sublabel}</div>}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Infinite scroll sentinel / status (remote only) */}
            {isRemote && (
              <div
                ref={sentinelRef}
                className="h-10 flex items-center justify-center text-xs text-muted-foreground"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…
                  </span>
                ) : hasMore ? (
                  "Scroll to load more…"
                ) : (
                  "End of list"
                )}
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Small debounce hook
function useDebounced<T>(value: T, ms = 250) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
