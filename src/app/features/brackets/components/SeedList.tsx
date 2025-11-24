"use client";
import { useCallback, useState } from "react";
import type { TeamSeed } from "../types";
import { Button } from "@/components/ui/button";

type Props = {
  seeds: TeamSeed[];
  onShuffle: (next: TeamSeed[]) => Promise<void>;
};

export default function SeedList({ seeds, onShuffle }: Props) {
  const [local, setLocal] = useState<TeamSeed[]>(seeds);

  const shuffle = useCallback(async () => {
    const sh = [...local].sort(() => Math.random() - 0.5).map((s, i) => ({ ...s, seed: i + 1 }));
    setLocal(sh);
    await onShuffle(sh);
  }, [local, onShuffle]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Seeds</h3>
        <Button size="sm" onClick={shuffle}>Shuffle</Button>
      </div>
      <ul className="divide-y">
        {local.map((s) => (
          <li key={s.teamId} className="py-2 flex items-center gap-3">
            <span className="w-6 text-right">{s.seed}</span>
            <span className="truncate">{s.teamName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
