"use client";

import { useEffect, useState } from "react";
import { DashboardStats } from "@/app/features/tournaments/components/DashboardStats";
import { listTournaments } from "@/app/features/tournaments/api";
import { mockCounts } from "@/app/features/tournaments/mock-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [counts, setCounts] = useState({
    available: 0,
    total: 0,
    active: 0,
    mine: 0,
  });

  useEffect(() => {
    // try to infer counts from the list; if mock, it's consistent
    (async () => {
      try {
        const page = await listTournaments({ page: 1, limit: 50 });
        const { available, total, active, mine } = mockCounts(); // quick, consistent demo
        setCounts({ available, total: page.meta.total ?? total, active, mine });
      } catch {
        setCounts(mockCounts());
      }
    })();
  }, []);

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            My dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of your tournaments and activity.
          </p>
        </div>
        <Button asChild>
          <Link href="/tournament/new">Organize tournament</Link>
        </Button>
      </header>
      <DashboardStats {...counts} />
      {/* You can add tabs showing subsets (Joined, Organized, All) later */}
    </section>
  );
}
