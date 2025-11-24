"use client";
import { useCallback } from "react";
import { createBracket } from "../api";
import type { BracketConfig } from "../types";
import CreatePlayoffFromRRDialog from "./CreatePlayoffFromRRDialog";

type Props = { tournamentId: number };

export default function RRPlayoffCreator({ tournamentId }: Props) {
  const onCreate = useCallback(
    async (payload: { name: string; config: BracketConfig }) => {
      await createBracket(tournamentId, payload);
    },
    [tournamentId]
  );

  return <CreatePlayoffFromRRDialog tournamentId={tournamentId} onCreate={onCreate} />;
}
