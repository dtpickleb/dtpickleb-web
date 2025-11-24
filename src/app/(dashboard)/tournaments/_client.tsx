"use client";

import { useEffect, useState } from "react";
import { listTournaments } from "@/app/features/tournaments/api";
import { TournamentCard } from "@/app/features/tournaments/components/TournamentCard";
import {
  TournamentFilters,
  type Filters,
} from "@/app/features/tournaments/components/TournamentFilters";
import { TournamentStats } from "@/app/features/tournaments/components/TournamentStats";
import { RecentChampions } from "@/app/features/tournaments/components/RecentChampions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { toast } from "sonner";
import { Pagination } from "@/components/pagination";

function TournamentCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 space-y-3">
            {/* Tournament name */}
            <div className="h-7 w-3/4 bg-muted rounded-md animate-pulse" />
            {/* Venue location */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-muted rounded-md animate-pulse" />
            </div>
            {/* Date range */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-muted rounded-md animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {/* Status badge */}
            <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
            {/* Skill level badges */}
            <div className="flex gap-1">
              <div className="h-5 w-12 bg-muted rounded animate-pulse" />
              <div className="h-5 w-12 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded-md animate-pulse" />
          <div className="h-4 w-4/5 bg-muted rounded-md animate-pulse" />
        </div>

        {/* Bottom section with stats and buttons */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Players */}
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-12 bg-muted rounded-md animate-pulse" />
            </div>
            {/* Entry fee */}
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded-md animate-pulse" />
            </div>
            {/* Prize pool */}
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-20 bg-muted rounded-md animate-pulse" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-28 bg-muted rounded-md animate-pulse" />
            <div className="h-9 w-20 bg-muted rounded-md animate-pulse" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-3 w-32 bg-muted rounded-md animate-pulse" />
            <div className="h-3 w-16 bg-muted rounded-md animate-pulse" />
          </div>
          <div className="h-2 w-full bg-muted rounded-full animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export function AllTournamentsClient() {
  const [filters, setFilters] = useState<Filters>({});
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [data, setData] = useState<any>({ data: [], meta: { total: 0 } });
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await listTournaments({ ...filters, page, limit });
      setData(res);
      setInitialLoad(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load tournaments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [JSON.stringify(filters), page, limit]);

  // Mock data for recent champions
  const recentChampions = [
    {
      name: "Marcus Johnson",
      tournament: "Raleigh Spring Championship",
      division: "Men's Open",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Sarah Williams",
      tournament: "Raleigh Spring Championship",
      division: "Women's Open",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "David Chen",
      tournament: "Triangle Summer Series",
      division: "Men's 4.5",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  // Calculate tournament stats
  const tournamentStats = [
    {
      label: "Active Tournaments",
      value: data.data.filter((t: any) => t.isRegistrationOpen).length,
    },
    {
      label: "Total Prize Money",
      value: `$${data.data
        .reduce((sum: number, t: any) => sum + (t.prizePool || 0), 0)
        .toLocaleString()}`,
    },
    {
      label: "Registered Players",
      value: data.data.reduce(
        (sum: number, t: any) => sum + (t.registeredPlayers || 0),
        0
      ),
    },
    {
      label: "Available Spots",
      value: data.data.reduce(
        (sum: number, t: any) =>
          sum + Math.max(0, (t.maxPlayers || 0) - (t.registeredPlayers || 0)),
        0
      ),
    },
  ];

  // Show full page loader only on initial load
  if (initialLoad && loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tournaments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <TournamentFilters value={filters} onChange={setFilters} />

        <div className="grid gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TournamentCardSkeleton key={i} />
            ))
          ) : data.data.length > 0 ? (
            data.data.map((t: any) => (
              <TournamentCard key={t.id} t={t} scope="all" />
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No tournaments found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search terms.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {!loading && (
          <Pagination
            page={page}
            limit={limit}
            total={data.meta?.total ?? 0}
            onPage={setPage}
          />
        )}
      </div>

      <div className="lg:w-80 space-y-6">
        <RecentChampions champions={recentChampions} />
        <TournamentStats stats={tournamentStats} />
      </div>
    </div>
  );
}
