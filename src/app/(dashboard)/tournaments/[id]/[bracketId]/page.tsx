"use client";
import { useParams } from "next/navigation";
import { BracketDetailClient } from "./_client";

export default function BracketDetailPage() {
  const { id, bracketId } = useParams<{ id: string; bracketId: string }>();
  return <BracketDetailClient tournamentId={id} bracketId={bracketId} />;
}
