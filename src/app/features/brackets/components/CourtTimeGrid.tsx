"use client";
import type { Slot } from "../scheduling";
import { useMemo, useState } from "react";

export function CourtTimeGrid({
  slots,
  labelOf,
  items, // { slot, content, matchId, teams }
  onMove, // (matchId, toSlot) => void
}: {
  slots: Slot[];
  labelOf: (slot: Slot) => string;
  items: Array<{ slot: Slot; matchId: string; teams: [string, string]; content: React.ReactNode }>;
  onMove: (args: { matchId: string; to: Slot }) => void;
}) {
  const courts = Array.from(new Set(slots.map(s => s.courtId)));
  const byCourt = (cid: string) => slots.filter(s => s.courtId === cid);

  // const bySlot = useMemo(() => {
  //   const m = new Map<Slot, { matchId: string; teams: [string, string] }>();
  //   items.forEach(i => m.set(i.slot, { matchId: i.matchId, teams: i.teams }));
  //   return m;
  // }, [items]);

  // Build conflict set: same team in overlapping slots
  const conflicts = useMemo(() => {
    const arr = items.map(i => ({ ...i, start: i.slot.start, end: i.slot.end }));
    const bad = new Set<string>();
    for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) {
      if (arr[i].teams.some(t => arr[j].teams.includes(t)) && (arr[i].start < arr[j].end && arr[j].start < arr[i].end)) {
        bad.add(arr[i].matchId); bad.add(arr[j].matchId);
      }
    }
    return bad;
  }, [items]);

  const [, setDrag] = useState<{ matchId: string } | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="p-2 text-left">Court / Time</th>
            {byCourt(courts[0]).map(s => (<th key={s.start.toISOString()} className="p-2 text-left">{labelOf(s)}</th>))}
          </tr>
        </thead>
        <tbody>
          {courts.map(cid => (
            <tr key={cid} className="border-t align-top">
              <td className="p-2 font-medium">{cid}</td>
              {byCourt(cid).map(slot => {
                const assignment = items.find(i => i.slot === slot);
                const droppable = {
                  onDragOver: (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; },
                  onDrop: (e: React.DragEvent) => {
                    e.preventDefault();
                    const matchId = e.dataTransfer.getData("text/matchId");
                    if (matchId) onMove({ matchId, to: slot });
                  }
                } as any;

                return (
                  <td key={slot.start.toISOString()} className="p-2 align-top" {...droppable}>
                    {assignment ? (
                      <div
                        draggable
                        onDragStart={(e) => { setDrag({ matchId: assignment.matchId }); e.dataTransfer.setData("text/matchId", assignment.matchId); e.dataTransfer.effectAllowed = "move"; }}
                        onDragEnd={() => setDrag(null)}
                        className={`rounded border p-2 ${conflicts.has(assignment.matchId) ? "border-destructive" : ""}`}
                        title={conflicts.has(assignment.matchId) ? "Team clash detected" : ""}
                      >
                        {assignment.matchId}
                        {conflicts.has(assignment.matchId) && <div className="mt-1 text-xs text-destructive">Clash</div>}
                      </div>
                    ) : (
                      <div className="rounded border border-dashed p-6 text-center text-muted-foreground">Drop here</div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
