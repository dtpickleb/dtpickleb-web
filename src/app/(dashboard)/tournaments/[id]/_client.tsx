"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTournament } from "@/app/features/tournaments/api";
import type { TournamentLite } from "@/app/features/tournaments/types";
import { TournamentHeader } from "@/app/features/tournaments/components/TournamentHeader";
import { TournamentInfoCards } from "@/app/features/tournaments/components/TournamentInfoCards";
import { TournamentTabs } from "@/app/features/tournaments/components/TournamentTabs";

export function TournamentDetailClient({ id }: { id: string }) {
  const [tournament, setTournament] = useState<TournamentLite | null>(null);
  const [loading, setLoading] = useState(true);
  // const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        const response = await getTournament(id);
        setTournament(response.data);
      } catch (error: any) {
        toast.error(error?.message ?? "Failed to load tournament");
        setTournament(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tournament?.name,
        text: `Check out ${tournament?.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  // const handleFavorite = () => {
  //   setIsFavorited(!isFavorited);
  //   toast.success(isFavorited ? "Removed from favorites" : "Added to favorites");
  // };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <h3 className="text-lg font-medium">Loading tournament details...</h3>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium">Tournament not found</h3>
          <p className="text-muted-foreground mb-4">
            {`The tournament you're looking for doesn't exist`}
          </p>
          <Button asChild>
            <Link href="/tournaments">Back to Tournaments</Link>
          </Button>
        </div>
      </div>
    );
  }

  const canRegister =
    !!tournament.isRegistrationStarted &&
    !tournament.isRegistrationClosed &&
    !tournament.isTournamentEnded &&
    (!tournament.maxPlayers ||
      (tournament.participants?.length ?? 0) < tournament.maxPlayers);

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/tournaments" className="mr-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tournaments
          </Button>
        </Link>
      </div>

      {/* Tournament Header */}
      <TournamentHeader
        tournament={tournament}
        // isFavorited={isFavorited}
        // onFavorite={handleFavorite}
        onShare={handleShare}
        canRegister={canRegister}
      />

      {/* Tournament Info Cards */}
      <TournamentInfoCards tournament={tournament} />

      {/* Tabs */}
      <TournamentTabs tournament={tournament} />
    </div>
  );
}
