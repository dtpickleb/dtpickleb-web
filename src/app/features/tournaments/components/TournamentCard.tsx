// apps/web/src/app/features/tournaments/components/TournamentCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Calendar, Users, DollarSign, Clock, Star, Layout, Plus } from "lucide-react";
import type { TournamentLite } from "../types";

type TournamentCardProps = {
  t: TournamentLite & {
    venue?: string;
    time?: string;
    status?: string;
    maxPlayers?: number;
    registeredPlayers?: number;
    prizePool?: number;
    skillLevels?: string[];
    organizer?: {
      name: string;
      rating: number;
    };
    description?: string;
    format?: string;
  };
  scope: "all" | "organize" | "mine";
};

export function TournamentCard({ t, scope }: TournamentCardProps) {
  const router = useRouter();
  const viewHref = `/tournaments/${t.id}`;

  // Use API-provided status flags with fallback to legacy fields
  const isRegistrationStarted =
    t.isRegistrationStarted ?? !!t.isRegistrationOpen;
  const isRegistrationClosed = t.isRegistrationClosed ?? !t.isRegistrationOpen;
  const isTournamentEnded = t.isTournamentEnded ?? !!t.isCompleted;
  const isRegisteredByPlayer = t.isRegisteredByPlayer ?? false;

  const canRegister = isRegistrationStarted && !isRegistrationClosed;
  const isCompleted = isTournamentEnded;

  const secondaryHref =
    scope === "organize"
      ? `/tournament/${t.id}/edit`
      : `/tournaments/${t.id}/register`;

  const getStatusBadge = () => {
    const registeredCount = t.participants?.length ?? t.registeredPlayers ?? 0;
    const isFull = t.maxPlayers && registeredCount >= t.maxPlayers;

    if (isCompleted) {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Completed
        </Badge>
      );
    }
    if (canRegister && !isFull) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Open
        </Badge>
      );
    }
    if (isFull) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Full</Badge>
      );
    }
    if (!isRegistrationStarted) {
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          Not Started
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Closed</Badge>
    );
  };

  const getRegistrationProgress = () => {
    const registeredCount = t.participants?.length ?? t.registeredPlayers ?? 0;
    if (!t.maxPlayers) return null;
    const percentage = (registeredCount / t.maxPlayers) * 100;
    const color =
      percentage >= 90
        ? "bg-red-500"
        : percentage >= 70
        ? "bg-yellow-500"
        : "bg-green-500";
    return { percentage, color };
  };

  const progress = getRegistrationProgress();

  // Extract venue and location info from API response
  const venue = t.facility?.venuePark ?? t.venue;
  const city = t.country?.name ?? t.city;
  const registeredCount = t.participants?.length ?? t.registeredPlayers ?? 0;
  const prizePool = t.prizeMoney ? Number(t.prizeMoney) : t.prizePool;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{t.name}</h3>
            {venue && (
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {venue}
                  {city ? `, ${city}` : ""}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {dateRange(t.eventStartDate, t.eventEndDate)}
                {t.time && ` at ${t.time}`}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge()}
            {t.skillLevels && t.skillLevels.length > 0 && (
              <div className="flex gap-1">
                {t.skillLevels.slice(0, 3).map((level) => (
                  <Badge key={level} variant="outline" className="text-xs">
                    {level}
                  </Badge>
                ))}
                {t.skillLevels.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{t.skillLevels.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {t.description && (
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {t.description}
          </p>
        )}

        {/* Bracket listing for organizers */}
        {scope === "organize" && t.brackets && t.brackets.length > 0 && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Layout className="w-4 h-4" />
              <span className="text-sm font-medium">Brackets ({t.brackets.length})</span>
            </div>
            <div className="space-y-1">
              {t.brackets.slice(0, 3).map((bracket: any) => (
                <div key={bracket.id} className="text-sm text-muted-foreground flex items-center justify-between">
                  <span>{bracket.label || bracket.name || `Bracket ${bracket.id}`}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/tournaments/${t.id}/bracket/${bracket.id}`);
                    }}
                  >
                    View
                  </Button>
                </div>
              ))}
              {t.brackets.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{t.brackets.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {t.maxPlayers && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>
                  {registeredCount}/{t.maxPlayers}
                </span>
              </div>
            )}
            {t.tournamentFee && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>
                  {t.feeCurrency ?? "$"}{" "}
                  {Number(t.tournamentFee).toLocaleString()} Entry
                </span>
              </div>
            )}
            {prizePool && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>${prizePool.toLocaleString()} Prize</span>
              </div>
            )}
            {t.format && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{t.format}</span>
              </div>
            )}
            {t.organizer && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{t.organizer.rating}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(viewHref)}
            >
              View Details
            </Button>

            {scope === "organize" ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/tournaments/${t.id}/bracket/create`)}
                  disabled={isRegistrationStarted}
                  title={isRegistrationStarted ? "Cannot create bracket after registration has started" : "Create bracket"}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create Bracket
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push(secondaryHref)}
                  disabled={isRegistrationStarted}
                  title={isRegistrationStarted ? "Cannot edit tournament after registration has started" : "Edit tournament"}
                >
                  Edit
                </Button>
              </>
            ) : isCompleted ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => router.push(viewHref)}
              >
                View Results
              </Button>
            ) : isRegisteredByPlayer ? (
              <Button size="sm" variant="secondary" disabled>
                Already Registered
              </Button>
            ) : canRegister &&
              (!t.maxPlayers || registeredCount < t.maxPlayers) ? (
              <Button size="sm" onClick={() => router.push(secondaryHref)}>
                Register
              </Button>
            ) : t.maxPlayers && registeredCount >= t.maxPlayers ? (
              <Button size="sm" disabled>
                Full
              </Button>
            ) : !isRegistrationStarted ? (
              <Button size="sm" disabled>
                Not Open Yet
              </Button>
            ) : (
              <Button size="sm" disabled>
                Registration Closed
              </Button>
            )}
          </div>
        </div>

        {canRegister && progress && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Registration Progress</span>
              <span>{progress.percentage.toFixed(0)}% Full</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${progress.color}`}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function dateRange(s?: string | null, e?: string | null) {
  if (!s && !e) return "Dates TBA";
  const f = (x?: string | null) =>
    x ? new Date(x).toLocaleDateString() : "TBA";
  return `${f(s)} – ${f(e)}`;
}
