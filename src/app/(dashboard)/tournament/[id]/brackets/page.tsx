"use client";

import { useParams } from "next/navigation";
import BracketEditor from "@/app/features/brackets/components/BracketEditor";

export default function BracketEditorPage() {
  const { id, bracketId } = useParams<{ id: string; bracketId: string }>();
  return <BracketEditor tournamentId={Number(id)} bracketId={Number(bracketId)} />;
}
