// apps/web/src/app/features/tournaments/components/DashboardStats.tsx
"use client";

export function DashboardStats(props: {
  available: number; total: number; active: number; mine: number;
}) {
  const Item = ({ title, value, sub }: { title: string; value: number; sub: string }) => (
    <div className="rounded-lg border bg-card p-5">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Item title="Available Leagues" value={props.available} sub="Open for registration" />
      <Item title="Total Leagues" value={props.total} sub="All leagues" />
      <Item title="Active Leagues" value={props.active} sub="Currently playing" />
      <Item title="Your Leagues" value={props.mine} sub="Joined or organized" />
    </div>
  );
}
