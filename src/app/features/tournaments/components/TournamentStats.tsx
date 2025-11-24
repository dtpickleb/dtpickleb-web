"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatItem = {
  label: string;
  value: string | number;
};

type TournamentStatsProps = {
  stats: StatItem[];
};

export function TournamentStats({ stats }: TournamentStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tournament Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <span className="font-semibold">{stat.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
