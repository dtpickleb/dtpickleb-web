"use client";
import Link from "next/link";
import type { BracketLite } from "../types";

type Props = {
  items: BracketLite[];
  tournamentId: number;
};

export default function BracketList({ items, tournamentId }: Props) {
  return (
    <ul className="divide-y rounded-md border">
      {items.map((b) => (
        <li key={b.id} className="flex items-center justify-between p-3">
          <div>
            <div className="font-medium">{b.name}</div>
            <div className="text-xs text-muted-foreground">
              {b.type} • {b.teams} teams
            </div>
          </div>
          <Link
            href={`/dashboard/organize/${tournamentId}/brackets/${b.id}`}
            className="text-sm underline"
          >
            Open
          </Link>
        </li>
      ))}
    </ul>
  );
}
