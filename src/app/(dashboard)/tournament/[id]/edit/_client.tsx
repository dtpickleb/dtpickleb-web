"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getTournament } from "@/app/features/tournaments/api";
import type { TournamentLite } from "@/app/features/tournaments/types";
import TournamentForm from "@/app/features/tournaments/components/TournamentForm";

export function EditTournamentClient({ id }: { id: string }) {
  const [tournament, setTournament] = useState<TournamentLite | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        const response = await getTournament(id);
        setTournament(response.data);
      } catch (error: any) {
        toast.error(error?.message ?? "Failed to load tournament");
        router.push("/tournaments");
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id, router]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <h3 className="text-lg font-medium">Loading tournament...</h3>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return null;
  }

  const isRegistrationStarted = tournament.isRegistrationStarted ?? !!tournament.isRegistrationOpen;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href={`/tournaments/${id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tournament
          </Button>
        </Link>

        <Button
          size="sm"
          onClick={() => router.push(`/tournaments/${id}/bracket/create`)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Bracket
        </Button>
      </div>

      {/* Warning message if registration has started */}
      {isRegistrationStarted && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">
                Tournament Cannot Be Edited
              </h3>
              <p className="text-sm text-yellow-800 mt-1">
                This tournament cannot be edited because registration has already started.
                Please contact support if you need to make changes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tournament Form */}
      <TournamentForm
        mode="edit"
        tournamentId={id}
        initialData={tournament}
        isRegistrationStarted={isRegistrationStarted}
      />
    </div>
  );
}
