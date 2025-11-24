import BracketForm from "@/app/features/tournaments/components/BracketForm";

export default async function BracketEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log(id);

  return (
    <div className="max-w-6xl mx-auto py-2">
      <BracketForm tournamentId={Number(id)} />
    </div>
  );
}
