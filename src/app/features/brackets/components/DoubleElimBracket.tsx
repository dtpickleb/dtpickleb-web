"use client";

import type { BracketDetail } from "../types";
import { buildDETopology } from "../topology";

type Props = {
  detail: BracketDetail;
  losersCanWinGold: boolean;
  grandFinalReset?: boolean;
};

export default function DoubleElimBracket({ detail, losersCanWinGold, grandFinalReset }: Props) {
  const topo = buildDETopology(detail.config.seeds, { losersCanWinGold, grandFinalReset });

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-8">
        {/* Winners bracket */}
        {topo.wbRounds.map((round, ri) => (
          <div key={`W-${ri}`} className="space-y-3">
            <div className="font-medium">W{ri + 1}</div>
            {round.map((id) => (
              <div key={id} className="rounded-md border p-2 text-sm">{id}</div>
            ))}
          </div>
        ))}

        {/* Losers bracket (stages) */}
        {topo.lbStages.map((stage, si) => (
          <div key={`L-${si}`} className="space-y-3">
            <div className="font-medium">L{si + 1}</div>
            {stage.map((id) => (
              <div key={id} className="rounded-md border p-2 text-sm">{id}</div>
            ))}
          </div>
        ))}

        {/* Grand Final(s) */}
        {topo.gf.length > 0 && (
          <div className="space-y-3">
            <div className="font-medium">GF</div>
            {topo.gf.map((id) => (
              <div key={id} className="rounded-md border p-2 text-sm">{id}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
