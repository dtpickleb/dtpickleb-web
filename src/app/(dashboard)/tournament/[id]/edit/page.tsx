import { EditTournamentClient } from "./_client";

export default async function EditTournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditTournamentClient id={id} />;
}
