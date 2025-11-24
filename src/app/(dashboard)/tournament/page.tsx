"use client";

import { useEffect, useState } from "react";
import { listMyOrganized } from "@/app/features/tournaments/api";
import { TournamentCard } from "@/app/features/tournaments/components/TournamentCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function OrganizeListPage() {
  const [data, setData] = useState<any>({ data: [], total: 0 });

  useEffect(() => {
    (async () => {
      try {
        setData(await listMyOrganized({ page: 1, limit: 12 }));
      } catch (e: any) {
        toast.error(e?.message ?? "Failed to load your tournaments");
      }
    })();
  }, []);

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Organize</h1>
          <p className="text-muted-foreground">Tournaments you manage.</p>
        </div>
        <Button asChild>
          <Link href="/tournament/new">Organize tournament</Link>
        </Button>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.data.map((t: any) => (
          <TournamentCard key={t.id} t={t} scope="organize" />
        ))}
      </div>
    </section>
  );
}
