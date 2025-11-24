"use client";
export function PrintButton({ label = "Print / Save PDF" }: { label?: string }) {
  return (
    <button className="btn btn-outline" onClick={() => window.print()}>
      {label}
    </button>
  );
}
