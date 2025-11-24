"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
// import { saveMatchScore } from "@/app/features/tournaments/api";

type Participant = {
  id: string;
  resultText: string | null;
  isWinner: boolean;
  status: string | null;
  name: string;
  picture: string | null;
  score?: number;
};

type Match = {
  id: number;
  name: string;
  nextMatchId: number | null;
  nextLooserMatchId: number | null;
  tournamentRoundText: string;
  startTime: string;
  state: "DONE" | "SCHEDULED" | "IN_PROGRESS";
  participants: Participant[];
};

type BracketScheduleProps = {
  matches: Match[];
  editable?: boolean;
};

export function BracketSchedule({ matches, editable = true }: BracketScheduleProps) {
  const [matchScores, setMatchScores] = useState<Record<number, { [participantId: string]: number }>>({});
  const [savingMatches, setSavingMatches] = useState<Set<number>>(new Set());
  const [savedMatches, setSavedMatches] = useState<Set<number>>(new Set());
  const [openModalMatchId, setOpenModalMatchId] = useState<number | null>(null);
  const [tempScores, setTempScores] = useState<{ [participantId: string]: number }>({});

  // Group matches by round
  const matchesByRound = matches.reduce((acc, match) => {
    const round = match.tournamentRoundText;
    if (!acc[round]) {
      acc[round] = [];
    }
    acc[round].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  // Sort rounds numerically
  const sortedRounds = Object.keys(matchesByRound).sort(
    (a, b) => Number(a) - Number(b)
  );

  const totalRounds = sortedRounds.length;

  // Get round labels
  const getRoundLabel = (roundNumber: string) => {
    const round = Number(roundNumber);
    const roundsFromEnd = totalRounds - round;

    if (totalRounds >= 4) {
      if (roundsFromEnd === 0) return "Final";
      if (roundsFromEnd === 1) return "Semi-final";
      if (roundsFromEnd === 2) return "Quarter-Final";
    } else {
      if (roundsFromEnd === 0) return "Final";
    }

    return `Round ${round}`;
  };

  const handleOpenModal = (matchId: number, participants: Participant[]) => {
    setOpenModalMatchId(matchId);
    // Initialize temp scores with existing scores or empty
    const existingScores = matchScores[matchId] || {};
    const initialScores: { [participantId: string]: number } = {};
    participants.forEach(p => {
      initialScores[p.id] = existingScores[p.id] || 0;
    });
    setTempScores(initialScores);
  };

  const handleCloseModal = () => {
    setOpenModalMatchId(null);
    setTempScores({});
  };

  const handleTempScoreChange = (participantId: string, value: string) => {
    const score = parseInt(value) || 0;
    setTempScores(prev => ({
      ...prev,
      [participantId]: score
    }));
  };

  const handleConfirmScores = () => {
    if (openModalMatchId !== null) {
      setMatchScores(prev => ({
        ...prev,
        [openModalMatchId]: tempScores
      }));
      handleCloseModal();
    }
  };

  const handleSaveScore = async (matchId: number) => {
    const scores = matchScores[matchId];
    if (!scores) return;

    try {
      setSavingMatches(prev => new Set(prev).add(matchId));
      console.log('Saving scores for match:', matchId, scores);

      // TODO: Uncomment when API is ready
      // await saveMatchScore(matchId, scores);

      await new Promise(resolve => setTimeout(resolve, 500));

      setSavedMatches(prev => new Set(prev).add(matchId));

      setMatchScores(prev => {
        const newScores = { ...prev };
        delete newScores[matchId];
        return newScores;
      });

      toast.success("Score saved successfully!");

    } catch (error) {
      console.error('Failed to save scores:', error);
      toast.error("Failed to save score. Please try again.");
    } finally {
      setSavingMatches(prev => {
        const newSet = new Set(prev);
        newSet.delete(matchId);
        return newSet;
      });
    }
  };

  if (!matches || matches.length === 0) {
    return (
      <div className="relative bg-[#0f1729] p-8 rounded-lg">
        <p className="text-slate-400">No matches available</p>
      </div>
    );
  }

  return (
    <div className="relative bg-[#0f1729] rounded-lg p-8">
      <div className="overflow-x-auto">
        <div className="flex gap-16 min-w-max">
          {sortedRounds.map((roundKey, roundIndex) => {
            const roundMatches = matchesByRound[roundKey];
            const roundLabel = getRoundLabel(roundKey);

            // Calculate vertical spacing
            const matchHeight = 120;
            const baseGap = 16;
            const multiplier = Math.pow(2, roundIndex);
            const gap = roundIndex === 0 ? baseGap : (matchHeight + baseGap) * multiplier - matchHeight;
            const topOffset = roundIndex === 0 ? 0 : ((matchHeight + baseGap) * (multiplier / 2)) - (matchHeight / 2);

            return (
              <div key={roundKey} className="flex flex-col" style={{ minWidth: '280px' }}>
                {/* Round Header */}
                <div className="bg-[#2d3748] text-white text-center py-2.5 px-4 rounded-t font-medium text-sm mb-8">
                  {roundLabel}
                </div>

                {/* Matches */}
                <div
                  className="flex flex-col relative"
                  style={{
                    gap: `${gap}px`,
                    marginTop: `${topOffset}px`
                  }}
                >
                  {roundMatches.map((match, matchIndex) => {
                    const hasScores = matchScores[match.id];
                    const isMatchComplete = match.state === "DONE";
                    const isSaving = savingMatches.has(match.id);
                    const isSaved = savedMatches.has(match.id);

                    return (
                      <div key={match.id} className="relative" style={{ height: `${matchHeight}px` }}>
                        {/* Date */}
                        <div className="text-xs text-slate-500 mb-2">
                          {match.startTime}
                        </div>

                        {/* Match Card */}
                        <div
                          className={`bg-[#1e293b] border border-slate-700 rounded overflow-hidden ${
                            !isMatchComplete && editable && match.participants.some(p => p.name && p.name !== "TBD")
                              ? "cursor-pointer hover:border-slate-600 transition-colors"
                              : ""
                          }`}
                          onClick={() => {
                            if (!isMatchComplete && editable && match.participants.some(p => p.name && p.name !== "TBD")) {
                              handleOpenModal(match.id, match.participants);
                            }
                          }}
                        >
                          {match.participants.map((participant, pIndex) => (
                            <div
                              key={participant.id}
                              className={`flex items-center justify-between px-3 py-2.5 ${
                                pIndex === 0 ? "border-b border-slate-700" : ""
                              }`}
                              style={{
                                backgroundColor: participant.isWinner && isMatchComplete ? '#1e3a2e' : 'transparent'
                              }}
                            >
                              <span className={`text-sm truncate max-w-[150px] ${
                                participant.isWinner && isMatchComplete ? "text-white font-medium" : "text-slate-300"
                              }`}>
                                {participant.name || "TBD"}
                              </span>

                              {isMatchComplete ? (
                                <span className={`text-xs font-medium px-2.5 py-1 rounded ${
                                  participant.isWinner ? "bg-green-600 text-white" : "text-red-400"
                                }`}>
                                  {participant.isWinner ? "Won" : "Lost"}
                                </span>
                              ) : matchScores[match.id]?.[participant.id] !== undefined ? (
                                <span className="text-sm font-medium text-white px-2.5 py-1 bg-slate-700 rounded">
                                  {matchScores[match.id][participant.id]}
                                </span>
                              ) : null}
                            </div>
                          ))}
                        </div>

                        {/* Match Label */}
                        <div className="text-center text-xs text-slate-500 mt-1.5">
                          {match.name}
                        </div>

                        {/* Save Button */}
                        {!isMatchComplete && editable && hasScores && !isSaved && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveScore(match.id);
                            }}
                            disabled={isSaving}
                            className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white text-xs h-7"
                          >
                            {isSaving ? "Saving..." : "Save Score"}
                          </Button>
                        )}

                        {/* Connector Lines */}
                        {roundIndex < sortedRounds.length - 1 && match.nextMatchId && (
                          <>
                            {/* Horizontal line from match */}
                            <div
                              className="absolute bg-slate-600"
                              style={{
                                left: '100%',
                                top: '50%',
                                width: '32px',
                                height: '2px',
                                zIndex: 0
                              }}
                            />

                            {/* Vertical connector (only for even-indexed matches) */}
                            {matchIndex % 2 === 0 && matchIndex + 1 < roundMatches.length && (
                              <>
                                <div
                                  className="absolute bg-slate-600"
                                  style={{
                                    left: 'calc(100% + 32px)',
                                    top: '50%',
                                    width: '2px',
                                    height: `${gap + matchHeight}px`,
                                    zIndex: 0
                                  }}
                                />
                                {/* Horizontal line to next round */}
                                <div
                                  className="absolute bg-slate-600"
                                  style={{
                                    left: 'calc(100% + 32px)',
                                    top: `calc(50% + ${(gap + matchHeight) / 2}px)`,
                                    width: '32px',
                                    height: '2px',
                                    zIndex: 0
                                  }}
                                />
                              </>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score Entry Modal */}
      <Dialog open={openModalMatchId !== null} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="bg-[#1e293b] border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Enter Match Score</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {openModalMatchId !== null && matches.find(m => m.id === openModalMatchId)?.participants.map((participant) => (
              <div key={participant.id} className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  {participant.name || "TBD"}
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Enter score"
                  value={tempScores[participant.id] || ""}
                  onChange={(e) => handleTempScoreChange(participant.id, e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={!participant.name || participant.name === "TBD"}
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseModal}
              className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmScores}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
