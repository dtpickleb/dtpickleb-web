// apps/web/src/app/features/brackets/components/ConnectorsOverlay.tsx
"use client";

import React from "react";
import type { Edge } from "../topology";

/**
 * Draws SVG connectors between match cards.
 * Expects each match card element to have data-match-id="<matchId>".
 */
export function ConnectorsOverlay({
  root,
  edges,
  matchSelector,
}: {
  root: React.RefObject<HTMLElement | null>;
  edges: Edge[];
  matchSelector: string; // e.g. '[data-match-id]'
}) {
  const [lines, setLines] = React.useState<Array<{ x1: number; y1: number; x2: number; y2: number }>>([]);

  React.useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const fromTo = (id: string) => el.querySelector<HTMLElement>(`${matchSelector}[data-match-id="${id}"]`);
    const rectOf = (node: HTMLElement) => node.getBoundingClientRect();

    const r = el.getBoundingClientRect();

    const newLines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    edges.forEach(({ from, to }) => {
      const A = fromTo(from);
      const B = fromTo(to);
      if (!A || !B) return;

      const aRect = rectOf(A);
      const bRect = rectOf(B);

      const x1 = aRect.right - r.left;
      const y1 = aRect.top + aRect.height / 2 - r.top;

      const x2 = bRect.left - r.left;
      const y2 = bRect.top + bRect.height / 2 - r.top;

      newLines.push({ x1, y1, x2, y2 });
    });

    setLines(newLines);
  }, [root, edges, matchSelector]);

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full">
      {lines.map((L, i) => (
        <line key={i} x1={L.x1} y1={L.y1} x2={L.x2} y2={L.y2} stroke="currentColor" strokeWidth="2" className="text-muted-foreground/40" />
      ))}
    </svg>
  );
}
