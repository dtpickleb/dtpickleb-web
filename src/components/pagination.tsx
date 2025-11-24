"use client";
export function Pagination({ page, limit, total, onPage }: {
  page: number; limit: number; total: number; onPage: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / limit));
  return (
    <div className="mt-4 flex items-center justify-between">
      <button className="btn btn-outline" disabled={page <= 1} onClick={() => onPage(page - 1)}>Prev</button>
      <div className="text-sm text-muted-foreground">Page {page} of {pages}</div>
      <button className="btn btn-outline" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button>
    </div>
  );
}
