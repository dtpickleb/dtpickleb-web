"use client";

/** Export a bracket schedule to CSV.
 *  Pass optional `meta` to add a header row with tournament info.
 */
export function exportCSV(
  rows: Array<{
    matchId: string;
    bracket: string;
    round: number;
    courtId: string;
    start: Date;
    end: Date;
    home?: string;
    away?: string;
  }>,
  meta?: { tournament: string; bracket: string; generatedAt?: Date }
) {
  const head = ["matchId", "bracket", "round", "courtId", "start", "end", "home", "away"];
  const metaRow = meta
    ? `# Tournament: ${meta.tournament} | Bracket: ${meta.bracket} | Generated: ${(meta.generatedAt ?? new Date()).toISOString()
    }\n`
    : "";
  const body = rows.map((r) => [
    r.matchId,
    r.bracket,
    r.round,
    r.courtId,
    r.start.toISOString(),
    r.end.toISOString(),
    r.home ?? "",
    r.away ?? "",
  ]);
  const csv =
    metaRow +
    [head, ...body]
      .map((a) => a.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))
      .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "schedule.csv";
  a.click();
  URL.revokeObjectURL(url);
}

/** Small button wrapper used by the BracketEditor. */
export function ScheduleExportButton({
  rows,
  meta,
}: {
  rows: Parameters<typeof exportCSV>[0];
  /** optional meta so callers can provide tournament/bracket labels */
  meta?: Parameters<typeof exportCSV>[1];
}) {
  return (
    <button className="btn btn-outline" onClick={() => exportCSV(rows, meta)}>
      Export CSV
    </button>
  );
}
