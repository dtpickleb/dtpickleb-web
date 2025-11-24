"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getBracket,
  saveSeeds,
  generateSchedule,
  getTournamentBracketDetails,
  createBracketSchedule,
  getRRGroupSuggestion,
  createRRGroups,
} from "../api";
import type { BracketDetail, DoubleElimConfig, SingleElimConfig, TeamSeed } from "../types";
import SeedList from "./SeedList";
import SingleElimBracket from "./SingleElimBracket";
import DoubleElimBracket from "./DoubleElimBracket";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

type Props = { tournamentId: number; bracketId: number };

interface BracketExtras {
  is_schedule_created?: boolean;
  is_rr_groups_created?: boolean;
  match_system?: string;
  entries?: any[];
  tournament?: {
    createdById?: string;
  };
}

export default function BracketEditor({ tournamentId, bracketId }: Props) {
  const [detail, setDetail] = useState<BracketDetail | null>(null);
  const [bracketExtras, setBracketExtras] = useState<BracketExtras | null>(null);
  const [loading, setLoading] = useState(true);
  const [scheduling, setScheduling] = useState(false);
  const [showRRGroupDialog, setShowRRGroupDialog] = useState(false);
  const [rrGroupCount, setRRGroupCount] = useState<number>(2);
  const [rrSuggestion, setRRSuggestion] = useState<{ minGroups: number; maxGroups: number } | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const [d, extras] = await Promise.all([
          getBracket(tournamentId, bracketId),
          getTournamentBracketDetails(bracketId),
        ]);
        if (active) {
          setDetail(d);
          setBracketExtras(extras);
        }
      } catch (error) {
        console.error("Failed to load bracket:", error);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [tournamentId, bracketId]);

  const onShuffle = async (seeds: TeamSeed[]) => {
    if (!detail) return;
    await saveSeeds(tournamentId, bracketId, seeds);
    setDetail({ ...detail, seeds });
  };

  const onGenerate = async () => {
    if (!detail) return;
    const { matches } = await generateSchedule(tournamentId, bracketId);
    setDetail({ ...detail, schedule: matches });
  };

  const isRoundRobin = detail?.config.type === "ROUND_ROBIN" ||
    bracketExtras?.match_system === "ROUND_ROBIN" ||
    bracketExtras?.match_system === "DOUBLE_ROUND_ROBIN";

  const canSchedule = bracketExtras &&
    !bracketExtras.is_schedule_created &&
    bracketExtras.entries &&
    bracketExtras.entries.filter((e: any) => e.status === "confirmed").length > 0;

  const needsRRGroups = isRoundRobin && !bracketExtras?.is_rr_groups_created;

  const handleScheduleClick = async () => {
    if (!bracketExtras) return;

    if (needsRRGroups) {
      // For round robin, first get group suggestions
      try {
        const suggestion = await getRRGroupSuggestion(bracketId);
        setRRSuggestion({ minGroups: suggestion.minGroups, maxGroups: suggestion.maxGroups });
        setRRGroupCount(suggestion.minGroups);
        setShowRRGroupDialog(true);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to get group suggestions");
      }
    } else {
      // For elimination brackets or RR with groups already created
      await createSchedule();
    }
  };

  const handleCreateRRGroups = async () => {
    try {
      setScheduling(true);
      await createRRGroups(bracketId, rrGroupCount);
      toast.success("Round robin groups created successfully");
      setShowRRGroupDialog(false);

      // Now create the schedule
      await createSchedule();

      // Refresh bracket extras
      const extras = await getTournamentBracketDetails(bracketId);
      setBracketExtras(extras);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create groups");
    } finally {
      setScheduling(false);
    }
  };

  const createSchedule = async () => {
    try {
      setScheduling(true);
      const result = await createBracketSchedule(bracketId);
      toast.success(`Schedule created with ${result.matches_created} matches`);

      // Refresh bracket extras
      const extras = await getTournamentBracketDetails(bracketId);
      setBracketExtras(extras);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create schedule");
    } finally {
      setScheduling(false);
    }
  };

  const body = useMemo(() => {
    if (!detail) return null;
    switch (detail.config.type) {
      case "SINGLE_ELIM": {
        const cfg = detail.config as SingleElimConfig;
        return <SingleElimBracket detail={detail} withBronze={!!cfg.thirdPlacePlayoff} />;
      }
      case "DOUBLE_ELIM": {
        const cfg = detail.config as DoubleElimConfig;
        const losersCanWinGold = cfg.variant === "LB_CAN_WIN";
        return (
          <DoubleElimBracket
            detail={detail}
            losersCanWinGold={losersCanWinGold}
            grandFinalReset={!!cfg.grandFinalReset}
          />
        );
      }
      case "ROUND_ROBIN": {
        return (
          <div className="text-sm text-muted-foreground">
            Round-robin: {detail.config.matchesPerPair ?? 1} match(es) per pair.
            <div className="mt-2">Scheduled matches: {detail.schedule.length}</div>
          </div>
        );
      }
    }
  }, [detail]);

  if (loading) return <div>Loading…</div>;
  if (!detail) return <div>Not found.</div>;

  const getScheduleButtonText = () => {
    if (bracketExtras?.is_schedule_created) {
      return "Schedule Created";
    }
    if (needsRRGroups) {
      return "Create Groups & Schedule";
    }
    return "Create Schedule";
  };

  const confirmedEntries = bracketExtras?.entries?.filter((e: any) => e.status === "confirmed").length || 0;

  return (
    <div className="grid gap-6 md:grid-cols-[280px,1fr]">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{detail.name}</h2>
        <SeedList seeds={detail.seeds} onShuffle={onShuffle} />

        {/* Schedule Button */}
        {canSchedule && (
          <Button
            onClick={handleScheduleClick}
            className="w-full"
            disabled={scheduling}
          >
            {scheduling ? "Creating..." : getScheduleButtonText()}
          </Button>
        )}

        {bracketExtras?.is_schedule_created && (
          <div className="text-sm text-green-600 text-center">
            Schedule has been created
          </div>
        )}

        {!canSchedule && !bracketExtras?.is_schedule_created && (
          <div className="text-sm text-muted-foreground text-center">
            {confirmedEntries === 0
              ? "No confirmed entries to schedule"
              : "Cannot create schedule"}
          </div>
        )}

        <Button onClick={onGenerate} className="w-full" variant="outline">
          Preview Schedule
        </Button>
      </div>
      <div className="min-h-[400px]">{body}</div>

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
