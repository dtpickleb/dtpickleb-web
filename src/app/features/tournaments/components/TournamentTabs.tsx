import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MapPin, Globe, ExternalLink, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { TournamentLite } from "../types";

interface TournamentTabsProps {
  tournament: TournamentLite;
}

export function TournamentTabs({ tournament }: TournamentTabsProps) {
  const router = useRouter();

  const handleBracketClick = (bracketId: number) => {
    router.push(`/tournaments/${tournament.id}/${bracketId}`);
  };

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="venue">Venue</TabsTrigger>
        <TabsTrigger value="brackets">Brackets</TabsTrigger>
        {/* <TabsTrigger value="participants">Participants</TabsTrigger> */}
      </TabsList>

      <TabsContent value="details" className="space-y-6 mt-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tournament Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tournament.sport && (
                <div>
                  <h4 className="font-medium mb-2">Sport</h4>
                  <p className="text-sm text-muted-foreground">
                    {tournament.sport.name}
                  </p>
                </div>
              )}

              {tournament.ballColor && (
                <div>
                  <h4 className="font-medium mb-2">Ball Color</h4>
                  <p className="text-sm text-muted-foreground">
                    {tournament.ballColor}
                  </p>
                </div>
              )}

              {tournament.surfaceType && (
                <div>
                  <h4 className="font-medium mb-2">Surface Type</h4>
                  <p className="text-sm text-muted-foreground">
                    {tournament.surfaceType}
                  </p>
                </div>
              )}

              {tournament.netType && (
                <div>
                  <h4 className="font-medium mb-2">Net Type</h4>
                  <p className="text-sm text-muted-foreground">
                    {tournament.netType}
                  </p>
                </div>
              )}

              {tournament.restTimeMinutes !== null &&
                tournament.restTimeMinutes !== undefined && (
                  <div>
                    <h4 className="font-medium mb-2">Rest Time</h4>
                    <p className="text-sm text-muted-foreground">
                      {tournament.restTimeMinutes} minutes
                    </p>
                  </div>
                )}

              {tournament.prizeMoney && (
                <div>
                  <h4 className="font-medium mb-2">Prize Pool</h4>
                  <p className="text-sm text-muted-foreground">
                    {tournament.prizeCurrency || "$"}
                    {Number(tournament.prizeMoney).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Policies & Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tournament.cancellationRefundPolicy && (
                <div>
                  <h4 className="font-medium mb-2">
                    Cancellation/Refund Policy
                  </h4>
                  <div
                    className="text-sm text-muted-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: tournament.cancellationRefundPolicy,
                    }}
                  />
                </div>
              )}

              {tournament.waiverLiabilityPolicy && (
                <div>
                  <h4 className="font-medium mb-2">Waiver/Liability Policy</h4>
                  <div
                    className="text-sm text-muted-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: tournament.waiverLiabilityPolicy,
                    }}
                  />
                </div>
              )}

              {tournament.covid19Policy && (
                <div>
                  <h4 className="font-medium mb-2">COVID-19 Policy</h4>
                  <div
                    className="text-sm text-muted-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: tournament.covid19Policy,
                    }}
                  />
                </div>
              )}

              {tournament.hotelInformation && (
                <div>
                  <h4 className="font-medium mb-2">Hotel Information</h4>
                  <div
                    className="text-sm text-muted-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: tournament.hotelInformation,
                    }}
                  />
                </div>
              )}

              {tournament.foodInformation && (
                <div>
                  <h4 className="font-medium mb-2">Food Information</h4>
                  <div
                    className="text-sm text-muted-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: tournament.foodInformation,
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="venue" className="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Venue Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tournament.facility && (
              <div>
                <h4 className="font-medium mb-2">
                  {tournament.facility.venuePark}
                </h4>
                <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <div>
                    {tournament.country && <p>{tournament.country.name}</p>}
                  </div>
                </div>
              </div>
            )}

            {tournament.website && (
              <div className="flex items-center space-x-2 text-sm">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <a
                  href={tournament.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Visit Website
                </a>
              </div>
            )}

            {tournament.facility && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      tournament.facility.venuePark
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Maps
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="brackets" className="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Brackets</CardTitle>
          </CardHeader>

          <CardContent>
            {tournament.brackets && tournament.brackets.length > 0 ? (
              <div className="space-y-4">
                {tournament.brackets.map((bracket: any, index: number) => (
                  <div
                    key={bracket.tournament_bracket_id || index}
                    className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() =>
                      handleBracketClick(bracket.tournament_bracket_id)
                    }
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base mb-1">
                          {bracket.label}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                            {bracket.match_system?.replace(/_/g, " ")}
                          </span>
                          {bracket.event_type_id && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                              Event Type: {bracket.event_type_id}
                            </span>
                          )}
                          {bracket.enable_registration && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium">
                              Registration Open
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {bracket.rr_playoff && (
                        <div>
                          <span className="text-muted-foreground">
                            Playoff:
                          </span>
                          <span className="ml-2 font-medium">
                            {bracket.rr_playoff.replace(/_/g, " ")}
                          </span>
                        </div>
                      )}
                      {bracket.bracket_start_date_time && (
                        <div>
                          <span className="text-muted-foreground">Start:</span>
                          <span className="ml-2 font-medium">
                            {new Date(
                              bracket.bracket_start_date_time
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {(bracket.min_skill_level_id ||
                        bracket.max_skill_level_id) && (
                          <div>
                            <span className="text-muted-foreground">
                              Skill Level:
                            </span>
                            <span className="ml-2 font-medium">
                              {bracket.min_skill_level_id || "Any"} -{" "}
                              {bracket.max_skill_level_id || "Any"}
                            </span>
                          </div>
                        )}
                      {(bracket.min_age || bracket.max_age) && (
                        <div>
                          <span className="text-muted-foreground">Age:</span>
                          <span className="ml-2 font-medium">
                            {bracket.min_age || "Any"} -{" "}
                            {bracket.max_age || "Any"}
                          </span>
                        </div>
                      )}
                      {bracket.event_fee_override_cents !== null && (
                        <div>
                          <span className="text-muted-foreground">Fee:</span>
                          <span className="ml-2 font-medium">
                            $
                            {(bracket.event_fee_override_cents / 100).toFixed(
                              2
                            )}
                          </span>
                        </div>
                      )}
                      {bracket.pools && (
                        <div>
                          <span className="text-muted-foreground">Pools:</span>
                          <span className="ml-2 font-medium">
                            {bracket.pools}
                          </span>
                        </div>
                      )}
                    </div>

                    {bracket.alternate_description && (
                      <p className="mt-3 text-sm text-muted-foreground">
                        {bracket.alternate_description}
                      </p>
                    )}

                    {bracket.comments && (
                      <p className="mt-2 text-sm text-muted-foreground italic">
                        Note: {bracket.comments}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No brackets created yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* <TabsContent value="participants" className="space-y-6 mt-6">
        {tournament.brackets && tournament.brackets.length > 0 ? (
          <div className="space-y-6">
            {tournament.brackets.map((bracket: any, bracketIndex: number) => {
              const bracketParticipants =
                tournament.participants?.filter(
                  (p: any) => p.bracketId === bracket.id
                ) || [];

              return (
                <Card key={bracket.id || bracketIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      {bracket.name || `Bracket ${bracketIndex + 1}`}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {bracketParticipants.length}{" "}
                      {bracketParticipants.length === 1
                        ? "participant"
                        : "participants"}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {bracketParticipants.length > 0 ? (
                      <div className="space-y-2">
                        {bracketParticipants.map(
                          (participant: any, index: number) => (
                            <div
                              key={participant.id || index}
                              className="p-3 border rounded-lg flex items-center justify-between hover:bg-accent transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {participant.playerName ||
                                      participant.teamName ||
                                      `Participant ${index + 1}`}
                                  </p>
                                  {participant.email && (
                                    <p className="text-sm text-muted-foreground">
                                      {participant.email}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {participant.registrationDate && (
                                <p className="text-xs text-muted-foreground">
                                  Registered:{" "}
                                  {new Date(
                                    participant.registrationDate
                                  ).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        No participants in this bracket yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
            </CardHeader>
            <CardContent>
              {tournament.participants && tournament.participants.length > 0 ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {tournament.participants.length}{" "}
                    {tournament.participants.length === 1
                      ? "participant"
                      : "participants"}{" "}
                    registered (No brackets created yet)
                  </p>
                  <div className="space-y-2">
                    {tournament.participants.map(
                      (participant: any, index: number) => (
                        <div
                          key={participant.id || index}
                          className="p-3 border rounded-lg flex items-center justify-between hover:bg-accent transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">
                                {participant.playerName ||
                                  participant.teamName ||
                                  `Participant ${index + 1}`}
                              </p>
                              {participant.email && (
                                <p className="text-sm text-muted-foreground">
                                  {participant.email}
                                </p>
                              )}
                            </div>
                          </div>
                          {participant.registrationDate && (
                            <p className="text-xs text-muted-foreground">
                              Registered:{" "}
                              {new Date(
                                participant.registrationDate
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No participants registered yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </TabsContent> */}
    </Tabs>
  );
}
