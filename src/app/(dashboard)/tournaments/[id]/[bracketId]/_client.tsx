"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Trophy,
  Calendar,
  DollarSign,
  Target,
  Loader2,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getTournamentBracket
} from "@/app/features/tournaments/api";
import {
  createBracketSchedule,
  getRRGroupSuggestion,
  createRRGroups,
} from "@/app/features/brackets/api";
import type { TournamentBracket } from "@/app/features/tournaments/types";
import { BracketSchedule } from "@/app/features/brackets/components/BracketSchedule";
import { toast } from "sonner";

interface BracketDetailClientProps {
  tournamentId: string;
  bracketId: string;
}

export function BracketDetailClient({
  tournamentId,
  bracketId,
}: BracketDetailClientProps) {
  const router = useRouter();
  const [bracket, setBracket] = useState<TournamentBracket | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState(false);
  const [showRRGroupDialog, setShowRRGroupDialog] = useState(false);
  const [rrGroupCount, setRRGroupCount] = useState<number>(2);
  const [rrSuggestion, setRRSuggestion] = useState<{ minGroups: number; maxGroups: number } | null>(null);

  const isRoundRobin = bracket?.match_system === "ROUND_ROBIN" || bracket?.match_system === "DOUBLE_ROUND_ROBIN";
  const canSchedule = bracket && !bracket.is_schedule_created && bracket.entries && bracket.entries.filter((e: any) => e.status === "confirmed").length > 0;
  const needsRRGroups = isRoundRobin && !bracket?.is_rr_groups_created;

  const handleScheduleClick = async () => {
    if (!bracket) return;

    if (needsRRGroups) {
      try {
        const suggestion = await getRRGroupSuggestion(Number(bracketId));
        setRRSuggestion({ minGroups: suggestion.minGroups, maxGroups: suggestion.maxGroups });
        setRRGroupCount(suggestion.minGroups);
        setShowRRGroupDialog(true);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to get group suggestions");
      }
    } else {
      await createScheduleHandler();
    }
  };

  const handleCreateRRGroups = async () => {
    try {
      setScheduling(true);
      await createRRGroups(Number(bracketId), rrGroupCount);
      toast.success("Round robin groups created successfully");
      setShowRRGroupDialog(false);
      await createScheduleHandler();
      await reloadBracket();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create groups");
    } finally {
      setScheduling(false);
    }
  };

  const createScheduleHandler = async () => {
    try {
      setScheduling(true);
      const result = await createBracketSchedule(Number(bracketId));
      toast.success(`Schedule created with ${result.matches_created} matches`);
      await reloadBracket();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create schedule");
    } finally {
      setScheduling(false);
    }
  };

  const reloadBracket = async () => {
    try {
      const response = await getTournamentBracket(bracketId);
      setBracket(response.data);
    } catch (err) {
      console.error("Failed to reload bracket:", err);
    }
  };

  const getScheduleButtonText = () => {
    if (bracket?.is_schedule_created) {
      return "Schedule Created";
    }
    if (needsRRGroups) {
      return "Create Groups & Schedule";
    }
    return "Create Schedule";
  };

  useEffect(() => {
    async function loadBracket() {
      try {
        setLoading(true);
        const response = await getTournamentBracket(bracketId);

        setBracket(response.data);

        // Fetch matches for the bracket schedule
        // try {
        //   const matchesData = await getBracketMatches(bracketId);
        //   setMatches(matchesData);
        // } catch (matchError) {
        //   console.error("Failed to load matches:", matchError);
        //   // Don't set error - matches are optional
        // }

        // Dummy data for testing
        const dummyMatches = [
          {
            id: 19874,
            name: "Round 1 - Match 1",
            nextMatchId: 19875,
            nextLooserMatchId: null,
            tournamentRoundText: "1",
            startTime: "2025-11-30",
            state: "DONE",
            participants: [
              {
                id: "354506c4-d07d-4785-9759-755941a6cccc",
                resultText: null,
                isWinner: false,
                status: null,
                name: "AdamsinLaDoncu",
                picture: null,
              },
              {
                id: "354506c4-d07d-4785-9759-755941a6cccd",
                resultText: null,
                isWinner: true,
                status: null,
                name: "Test of Tests",
                picture: null,
              },
            ],
          },
          {
            id: 19875,
            name: "Round 1 - Match 2",
            nextMatchId: 19877,
            nextLooserMatchId: null,
            tournamentRoundText: "1",
            startTime: "2025-11-30",
            state: "DONE",
            participants: [
              {
                id: "354506c4-d07d-4785-9759-755941a6ccce",
                resultText: null,
                isWinner: false,
                status: null,
                name: "testtesttletstst",
                picture: null,
              },
              {
                id: "354506c4-d07d-4785-9759-755941a6cccf",
                resultText: null,
                isWinner: true,
                status: null,
                name: "test9",
                picture: null,
              },
            ],
          },
          {
            id: 19876,
            name: "Round 1 - Match 3",
            nextMatchId: 19878,
            nextLooserMatchId: null,
            tournamentRoundText: "1",
            startTime: "2025-11-30",
            state: "DONE",
            participants: [
              {
                id: "354506c4-d07d-4785-9759-755941a6ccd0",
                resultText: null,
                isWinner: true,
                status: null,
                name: "omaromar",
                picture: null,
              },
              {
                id: "354506c4-d07d-4785-9759-755941a6ccd1",
                resultText: null,
                isWinner: false,
                status: null,
                name: "Test3",
                picture: null,
              },
            ],
          },
          {
            id: 19877,
            name: "Round 2 - Match 1",
            nextMatchId: 19879,
            nextLooserMatchId: null,
            tournamentRoundText: "2",
            startTime: "2025-11-30",
            state: "SCHEDULED",
            participants: [
              {
                id: "354506c4-d07d-4785-9759-755941a6cccd",
                resultText: null,
                isWinner: false,
                status: null,
                name: "Test of Tests",
                picture: null,
              },
              {
                id: "354506c4-d07d-4785-9759-755941a6cccf",
                resultText: null,
                isWinner: false,
                status: null,
                name: "test9",
                picture: null,
              },
            ],
          },
          {
            id: 19878,
            name: "Round 2 - Match 2",
            nextMatchId: 19879,
            nextLooserMatchId: null,
            tournamentRoundText: "2",
            startTime: "2025-11-30",
            state: "DONE",
            participants: [
              {
                id: "354506c4-d07d-4785-9759-755941a6ccd0",
                resultText: null,
                isWinner: true,
                status: null,
                name: "omaromar",
                picture: null,
              },
              {
                id: "354506c4-d07d-4785-9759-755941a6ccd2",
                resultText: null,
                isWinner: false,
                status: null,
                name: "omar boi",
                picture: null,
              },
            ],
          },
          {
            id: 19879,
            name: "Round 3 - Match 1",
            nextMatchId: null,
            nextLooserMatchId: null,
            tournamentRoundText: "3",
            startTime: "2025-11-30",
            state: "SCHEDULED",
            participants: [
              {
                id: "354506c4-d07d-4785-9759-755941a6ccd0",
                resultText: null,
                isWinner: false,
                status: null,
                name: "omaromar",
                picture: null,
              },
              {
                id: "354506c4-d07d-4785-9759-755941a6ccd3",
                resultText: null,
                isWinner: false,
                status: null,
                name: "TBD",
                picture: null,
              },
            ],
          },
        ];
        setMatches(dummyMatches);
      } catch (err) {
        setError("Failed to load bracket details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadBracket();
  }, [bracketId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !bracket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">{error || "Bracket not found"}</p>
        <Button onClick={() => router.push(`/tournaments/${tournamentId}`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tournament
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/tournaments/${tournamentId}`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{bracket.label}</h1>
            <p className="text-muted-foreground mt-1">
              Tournament Bracket Details
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {canSchedule && (
            <Button
              onClick={handleScheduleClick}
              disabled={scheduling}
              size="sm"
            >
              {scheduling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {getScheduleButtonText()}
                </>
              )}
            </Button>
          )}
          {bracket.is_schedule_created && (
            <Badge variant="default" className="bg-green-600">
              Schedule Created
            </Badge>
          )}
          {bracket.enable_registration && (
            <Badge variant="default" className="bg-green-600">
              Registration Open
            </Badge>
          )}
          {bracket.is_active ? (
            <Badge variant="default">Active</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}
        </div>
      </div>

      {/* Bracket Information Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Match System</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bracket?.match_system?.replace(/_/g, " ")}
            </div>
            {bracket.rr_playoff && (
              <p className="text-xs text-muted-foreground mt-1">
                Playoff: {bracket?.rr_playoff?.replace(/_/g, " ")}
              </p>
            )}
          </CardContent>
        </Card>

        {bracket.event_type && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Event Type</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bracket.event_type.label}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {bracket.event_type.gender_scope} •{" "}
                {bracket.event_type.min_players_team}-
                {bracket.event_type.max_players_team} Players
              </p>
            </CardContent>
          </Card>
        )}

        {bracket.event_fee_override_cents !== null && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entry Fee</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(bracket.event_fee_override_cents / 100).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        )}

        {bracket.bracket_start_date_time && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Start Date</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {new Date(bracket.bracket_start_date_time).toLocaleDateString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(bracket.bracket_start_date_time).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detailed Information */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bracket Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(bracket.min_skill_level_id || bracket.max_skill_level_id) && (
              <div>
                <h4 className="font-medium mb-1">Skill Level Range</h4>
                <p className="text-sm text-muted-foreground">
                  {bracket.min_skill_level_id || "Any"} -{" "}
                  {bracket.max_skill_level_id || "Any"}
                </p>
              </div>
            )}

            {(bracket.min_age || bracket.max_age) && (
              <div>
                <h4 className="font-medium mb-1">Age Range</h4>
                <p className="text-sm text-muted-foreground">
                  {bracket.min_age || "Any"} - {bracket.max_age || "Any"} years
                </p>
              </div>
            )}

            {bracket.pools && (
              <div>
                <h4 className="font-medium mb-1">Number of Pools</h4>
                <p className="text-sm text-muted-foreground">{bracket.pools}</p>
              </div>
            )}

            {bracket.de_variant && (
              <div>
                <h4 className="font-medium mb-1">Double Elimination Variant</h4>
                <p className="text-sm text-muted-foreground">
                  {bracket.de_variant}
                </p>
              </div>
            )}

            {bracket.alternate_description && (
              <div>
                <h4 className="font-medium mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {bracket.alternate_description}
                </p>
              </div>
            )}

            {bracket.comments && (
              <div>
                <h4 className="font-medium mb-1">Comments</h4>
                <p className="text-sm text-muted-foreground italic">
                  {bracket.comments}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registration & Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Registration Status</h4>
              <p className="text-sm text-muted-foreground">
                {bracket.enable_registration ? "Open" : "Closed"}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Bracket Status</h4>
              <p className="text-sm text-muted-foreground">
                {bracket.is_active ? "Active" : "Inactive"}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Created</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(bracket.created_at).toLocaleString()}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Last Updated</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(bracket.updated_at).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participants and Results Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="bracket" className="w-full">
            <TabsList>
              <TabsTrigger value="bracket">
                <Trophy className="w-4 h-4 mr-2" />
                Bracket Schedule
              </TabsTrigger>
              <TabsTrigger value="participants">
                <Users className="w-4 h-4 mr-2" />
                Participants
              </TabsTrigger>
              <TabsTrigger value="matches">
                <Trophy className="w-4 h-4 mr-2" />
                Matches & Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bracket" className="mt-6">
              {matches && matches.length > 0 ? (
                <BracketSchedule matches={matches} />
              ) : (
                <div className="text-center py-12">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No bracket schedule available yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    The bracket schedule will appear here once matches are
                    generated
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="participants" className="mt-6">
              {bracket.participants && bracket.participants.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Registered Participants ({bracket.participants.length})
                    </h3>
                  </div>
                  <div className="grid gap-3">
                    {bracket.participants.map(
                      (participant: any, index: number) => (
                        <div
                          key={participant.id || index}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">
                                {participant.team_name ||
                                  participant.player_name ||
                                  `Participant ${index + 1}`}
                              </p>
                              {participant.skill_level && (
                                <p className="text-sm text-muted-foreground">
                                  Skill Level: {participant.skill_level}
                                </p>
                              )}
                            </div>
                          </div>
                          {participant.registration_date && (
                            <p className="text-sm text-muted-foreground">
                              Registered:{" "}
                              {new Date(
                                participant.registration_date
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No participants registered yet
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="matches" className="mt-6">
              {bracket.matches && bracket.matches.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Match Schedule & Results ({bracket.matches.length})
                    </h3>
                  </div>
                  <div className="grid gap-4">
                    {bracket.matches.map((match: any, index: number) => (
                      <Card key={match.id || index}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {match.round_name ||
                                  `Round ${match.round || index + 1}`}
                              </Badge>
                              {match.match_number && (
                                <span className="text-sm text-muted-foreground">
                                  Match #{match.match_number}
                                </span>
                              )}
                            </div>
                            {match.scheduled_time && (
                              <p className="text-sm text-muted-foreground">
                                {new Date(
                                  match.scheduled_time
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-accent/50 rounded">
                              <span className="font-medium">
                                {match.team1_name || "TBD"}
                              </span>
                              {match.team1_score !== undefined && (
                                <span className="text-xl font-bold">
                                  {match.team1_score}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-center text-muted-foreground text-sm">
                              vs
                            </div>
                            <div className="flex items-center justify-between p-3 bg-accent/50 rounded">
                              <span className="font-medium">
                                {match.team2_name || "TBD"}
                              </span>
                              {match.team2_score !== undefined && (
                                <span className="text-xl font-bold">
                                  {match.team2_score}
                                </span>
                              )}
                            </div>
                          </div>

                          {match.status && (
                            <div className="mt-4 flex justify-center">
                              <Badge
                                variant={
                                  match.status === "completed"
                                    ? "default"
                                    : match.status === "in_progress"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {match.status.replace(/_/g, " ").toUpperCase()}
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No matches scheduled yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Matches will appear here once the bracket is generated
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* RR Group Dialog */}
      <Dialog open={showRRGroupDialog} onOpenChange={setShowRRGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Round Robin Groups</DialogTitle>
            <DialogDescription>
              Choose the number of groups for round robin play.
              {rrSuggestion && (
                <span className="block mt-2">
                  Valid range: {rrSuggestion.minGroups} - {rrSuggestion.maxGroups} groups
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="groupCount" className="text-right">
                Groups
              </Label>
              <Input
                id="groupCount"
                type="number"
                value={rrGroupCount}
                onChange={(e) => setRRGroupCount(parseInt(e.target.value) || 2)}
                min={rrSuggestion?.minGroups || 1}
                max={rrSuggestion?.maxGroups || 10}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRRGroupDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRRGroups} disabled={scheduling}>
              {scheduling ? "Creating..." : "Create Groups & Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
