import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Users } from "lucide-react";
import Link from "next/link";
import type { TournamentLite } from "../types";

interface TournamentHeaderProps {
  tournament: TournamentLite;
  isFavorited?: boolean;
  onFavorite?: () => void;
  onShare: () => void;
  canRegister: boolean;
}

export function TournamentHeader({
  tournament,
  // isFavorited,
  // onFavorite,
  onShare,
  canRegister,
}: TournamentHeaderProps) {
  const getStatusBadge = () => {
    if (tournament.isTournamentEnded) {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Completed
        </Badge>
      );
    }
    if (canRegister) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Open
        </Badge>
      );
    }
    if (!tournament.isRegistrationStarted) {
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          Not Started
        </Badge>
      );
    }
    if (
      tournament.maxPlayers &&
      (tournament.participants?.length ?? 0) >= tournament.maxPlayers
    ) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Full</Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Closed</Badge>
    );
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{tournament.name}</h1>
            {getStatusBadge()}
          </div>

          {(tournament.comments || tournament.eventDayInstructions) && (
            <p
              className="text-muted-foreground text-lg mb-4"
              dangerouslySetInnerHTML={{
                __html: tournament.comments || tournament.eventDayInstructions || "",
              }}
            />
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {tournament.sport && (
              <Badge variant="outline">{tournament.sport.name}</Badge>
            )}
            {tournament.ballColor && (
              <Badge variant="secondary">{tournament.ballColor}</Badge>
            )}
            {tournament.surfaceType && (
              <Badge variant="secondary">{tournament.surfaceType}</Badge>
            )}
            {tournament.venueType && (
              <Badge variant="secondary">{tournament.venueType}</Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* <Button variant="outline" onClick={onFavorite}>
            <Heart
              className={`w-4 h-4 mr-2 ${
                isFavorited ? "fill-current text-red-500" : ""
              }`}
            />
            {isFavorited ? "Favorited" : "Favorite"}
          </Button> */}
          <Button variant="outline" onClick={onShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          {canRegister ? (
            <Button size="lg" asChild>
              <Link href={`/tournaments/${tournament.id}/register`}>
                <Users className="w-4 h-4 mr-2" />
                Register Now
              </Link>
            </Button>
          ) : tournament.isRegisteredByPlayer ? (
            <Button size="lg" variant="secondary" disabled>
              Already Registered
            </Button>
          ) : tournament.isTournamentEnded ? (
            <Button size="lg" variant="secondary" asChild>
              <Link href={`/tournaments/${tournament.id}`}>View Results</Link>
            </Button>
          ) : (
            <Button size="lg" disabled>
              Registration Closed
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
