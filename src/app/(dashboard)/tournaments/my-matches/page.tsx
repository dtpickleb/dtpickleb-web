"use client";

import React, { useEffect, useState } from "react";
import { fetchMyMatches } from "@/app/features/matches/api";
import type { MyMatchResponse } from "@/app/features/matches/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";
import { toast } from "sonner";

const MyMatches = () => {
  const [matches, setMatches] = useState<MyMatchResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await fetchMyMatches();
      setMatches(data);
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-800" },
      completed: { label: "Completed", className: "bg-green-100 text-green-800" },
      bye: { label: "Bye", className: "bg-gray-100 text-gray-800" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    return (
      <Badge className={`${config.className} hover:${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  const getStageBadge = (stage: string | null) => {
    if (!stage) return "";
    const stageLabels: Record<string, string> = {
      rr: "Round Robin",
      playoff: "Playoff",
      winners: "Winners",
      losers: "Losers",
      final: "Final",
      bronze: "Bronze",
    };
    return stageLabels[stage] || stage;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <h1 className="text-3xl font-bold mb-6">My Matches</h1>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Matches</h1>
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>You don&apos;t have any matches yet.</p>
            <p className="text-sm mt-2">
              Register for a tournament to start playing!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Matches</h1>
        <p className="text-muted-foreground mt-2">
          View all your upcoming and completed matches
        </p>
      </div>

      <div className="space-y-4">
        {matches.map((match) => {
          const myTeamName = match.mySide?.teamName || "TBD";
          const opponentTeamName = match.opponentSide?.teamName || "TBD";
          const isCompleted = match.status === "completed";
          const result = match.result;

          return (
            <Card key={match.matchId} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {match.tournamentName}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      {match.bracketName}
                      {match.rrGroupName && ` • ${match.rrGroupName}`}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(match.status)}
                    {match.stage && (
                      <Badge variant="outline" className="text-xs">
                        {getStageBadge(match.stage)}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-base">
                        {myTeamName}
                      </div>
                      <div className="text-xs text-muted-foreground">You</div>
                    </div>

                    <div className="px-6 text-center">
                      {isCompleted && result ? (
                        <div className="flex flex-col items-center">
                          <span
                            className={`text-lg font-bold ${result.isWin ? "text-green-600" : "text-red-500"
                              }`}
                          >
                            {result.isWin ? "WIN" : "LOSS"}
                          </span>
                        </div>
                      ) : (
                        <div className="text-muted-foreground font-medium">VS</div>
                      )}
                    </div>

                    <div className="flex-1 text-right">
                      <div className="font-semibold text-base">
                        {opponentTeamName}
                      </div>
                      <div className="text-xs text-muted-foreground">Opponent</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MyMatches;
