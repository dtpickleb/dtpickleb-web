// apps/web/src/app/features/brackets/components/ScheduleTable.tsx
"use client";

import type { Match } from "../types";

export default function ScheduleTable({ matches }: { matches: Match[] }) {
  if (!matches?.length) return <div className="text-sm text-muted-foreground">No matches yet.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left">
          <tr>
            <th className="p-2">Round</th>
            <th className="p-2">Group</th>
            <th className="p-2">Home</th>
            <th className="p-2">Away</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((m) => (
            <tr key={m.id} className="border-t">
              <td className="p-2">{m.round}</td>
              <td className="p-2">{m.group ?? "-"}</td>
              <td className="p-2">{m.home ?? "TBD"}</td>
              <td className="p-2">{m.away ?? "TBD"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
