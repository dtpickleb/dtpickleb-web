"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listMyOrganized } from "@/app/features/tournaments/api";
import { TournamentCard } from "@/app/features/tournaments/components/TournamentCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Plus } from "lucide-react";
import { toast } from "sonner";
import { Pagination } from "@/components/pagination";

export function MyTournamentsClient() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [data, setData] = useState<any>({ data: [], meta: { total: 0 } });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await listMyOrganized({ page, limit });
      setData(res);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load tournaments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    /* eslint-disable-next-line */
  }, [page, limit]);

  if (loading) {
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
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => router.push("/tournament/new/")}>
          <Plus className="w-4 h-4 mr-2" />
          Organize Tournament
        </Button>
      </div>

      <div className="grid gap-6">
        {data.data.map((t: any) => (
          <TournamentCard key={t.id} t={t} scope="organize" />
        ))}
      </div>

      {data.data.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No tournaments organized yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Start organizing your first tournament to see it here.
            </p>
            <Button onClick={() => router.push("/tournaments/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Organize Tournament
            </Button>
          </CardContent>
        </Card>
      )}

      <Pagination
        page={page}
        limit={limit}
        total={data.meta?.total ?? 0}
        onPage={setPage}
      />
    </div>
  );
}
