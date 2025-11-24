"use client";

import type { BracketDetail } from "../types";
import { buildSETopology } from "../topology";

type Props = {
  detail: BracketDetail;
  withBronze: boolean;
};

export default function SingleElimBracket({ detail, withBronze }: Props) {
  const topo = buildSETopology(detail.config.seeds, withBronze);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-8">
        {topo.rounds.map((round, ri) => (
          <div key={ri} className="space-y-3">
            <div className="font-medium">W{ri + 1}</div>
            {round.map((id) => (
              <div key={id} className="rounded-md border p-2 text-sm">{id}</div>
            ))}
          </div>
        ))}
        {/* Bronze node (if any) will be in topo.matches but not in rounds */}
        {topo.matches.filter((m) => m.startsWith("BRONZE")).map((id) => (
          <div key={id} className="space-y-3">
            <div className="font-medium">Bronze</div>
            <div className="rounded-md border p-2 text-sm">{id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
