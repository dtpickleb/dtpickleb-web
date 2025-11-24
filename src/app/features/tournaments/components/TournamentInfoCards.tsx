import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar, Users, DollarSign, Clock } from "lucide-react";
import type { TournamentLite } from "../types";

interface TournamentInfoCardsProps {
  tournament: TournamentLite;
}

export function TournamentInfoCards({ tournament }: TournamentInfoCardsProps) {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "TBA";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateRange = (start?: string | null, end?: string | null) => {
    if (!start) return "Dates TBA";
    const startDate = formatDate(start);
    const endDate = end && start !== end ? ` - ${formatDate(end)}` : "";
    return `${startDate}${endDate}`;
  };

  const registeredCount = tournament.participants?.length ?? 0;
  const spotsLeft = tournament.maxPlayers
    ? tournament.maxPlayers - registeredCount
    : null;

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Date</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {formatDateRange(tournament.eventStartDate, tournament.eventEndDate)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Participants</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {registeredCount}
            {tournament.maxPlayers && `/${tournament.maxPlayers}`}
          </div>
          <p className="text-xs text-muted-foreground">
            {tournament.isTournamentEnded
              ? "Final count"
              : spotsLeft !== null
              ? `${spotsLeft} spots available`
              : "Unlimited"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entry Fee</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {tournament.tournamentFee
              ? `${tournament.feeCurrency || "$"}${Number(
                  tournament.tournamentFee
                ).toLocaleString()}`
              : "Free"}
          </div>
          <p className="text-xs text-muted-foreground">Per player</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {tournament.isTournamentEnded ? "Completed" : "Registration"}
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {tournament.isTournamentEnded
              ? `Ended ${formatDate(tournament.eventEndDate)}`
              : tournament.registrationCloses
              ? `Closes ${formatDate(tournament.registrationCloses)}`
              : "Open Registration"}
          </div>
          <p className="text-xs text-muted-foreground">
            {tournament.isTournamentEnded
              ? "Tournament finished"
              : tournament.registrationCloses
              ? `${Math.max(
                  0,
                  Math.ceil(
                    (new Date(tournament.registrationCloses).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                )} days left`
              : "No deadline set"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
