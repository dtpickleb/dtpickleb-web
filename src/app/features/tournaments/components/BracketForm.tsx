"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import DateTimePicker from "@/app/features/tournaments/components/DateTimePicker";
import { bracketFormSchema, type BracketFormValues } from "../schema";
import {
  listEventTypes,
  listBracketFormats,
  listRRPlayoffFormats,
  listSportSkills,
  listScoringPresets,
  type BracketFormat,
  type RRPlayoffFormat,
  type SportSkill,
  type EventType,
  type ScoringPreset,
  createBracket,
} from "../api";

const REQUIRED = <span className="text-destructive">*</span>;

interface BracketFormProps {
  tournamentId: number;
}

export default function BracketForm({ tournamentId }: BracketFormProps) {
  const router = useRouter();
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [bracketFormats, setBracketFormats] = useState<BracketFormat[]>([]);
  const [rrPlayoffFormats, setRRPlayoffFormats] = useState<RRPlayoffFormat[]>(
    []
  );
  const [skillLevels, setSkillLevels] = useState<SportSkill[]>([]);
  const [scoringPresets, setScoringPresets] = useState<ScoringPreset[]>([]);

  const form = useForm<BracketFormValues>({
    resolver: zodResolver(bracketFormSchema),
    defaultValues: {
      bracketName: "",
      teamType: "",
      bracketFormat: "",
      rrPlayoffType: "",
      matchType: "",
      eliminationScoringPreset: "",
      medalScoringPreset: "",
      bracketFeePerPlayer: undefined,
      scheduledStartDate: undefined,
      lowSkillLevel: "",
      highSkillLevel: "",
      lowAge: undefined,
      highAge: undefined,
      pools: undefined,
      alternateDescription: "",
      comments: "",
      enableRegistration: false,
    },
    mode: "onChange",
  });

  const selectedBracketFormat = form.watch("bracketFormat");
  const selectedRRPlayoffType = form.watch("rrPlayoffType");
  const selectedMatchType = form.watch("matchType");

  const selectedBracketFormatData = useMemo(() => {
    return bracketFormats.find(
      (format) => String(format.bracket_format_id) === selectedBracketFormat
    );
  }, [selectedBracketFormat, bracketFormats]);

  const selectedPlayoffData = useMemo(() => {
    return rrPlayoffFormats.find(
      (format) => String(format.rr_playoff_format_id) === selectedRRPlayoffType
    );
  }, [selectedRRPlayoffType, rrPlayoffFormats]);

  const selectedMatchTypeData = useMemo(() => {
    return scoringPresets.find(
      (preset) => String(preset.id) === selectedMatchType
    );
  }, [selectedMatchType, scoringPresets]);

  const isRoundRobin = useMemo(() => {
    return (
      selectedBracketFormatData?.match_system === "ROUND_ROBIN" ||
      selectedBracketFormatData?.match_system === "DOUBLE_ROUND_ROBIN"
    );
  }, [selectedBracketFormatData]);

  const isSingleElimination =
    selectedBracketFormatData?.match_system === "SINGLE_ELIMINATION";
  const isDoubleElimination =
    selectedBracketFormatData?.match_system === "DOUBLE_ELIMINATION";

  useEffect(() => {
    const loadOptions = async () => {
      const [
        events,
        formats,
        rrPlayoffs,
        skills,
        presets,
      ] = await Promise.all([
        listEventTypes(),
        listBracketFormats(),
        listRRPlayoffFormats(),
        listSportSkills(1),
        listScoringPresets(),
      ]);
      setEventTypes(events);
      setBracketFormats(formats);
      setRRPlayoffFormats(rrPlayoffs);
      setSkillLevels(skills);
      setScoringPresets(presets);
    };
    loadOptions();
  }, []);

  useEffect(() => {
    if (selectedBracketFormat) {
      if (!isRoundRobin) {
        form.setValue("rrPlayoffType", undefined);
      }
    }
  }, [selectedBracketFormat, form, isRoundRobin]);

  const lowSkillLevel = form.watch("lowSkillLevel");
  const highSkillLevel = form.watch("highSkillLevel");
  const lowAge = form.watch("lowAge");
  const highAge = form.watch("highAge");

  useEffect(() => {
    if (lowSkillLevel && highSkillLevel && skillLevels.length > 0) {
      const minSkill = skillLevels.find(
        (s) => String(s.id) === String(lowSkillLevel)
      );
      const maxSkill = skillLevels.find(
        (s) => String(s.id) === String(highSkillLevel)
      );

      console.log("Skill Level Validation:", {
        lowSkillLevel,
        highSkillLevel,
        minSkill,
        maxSkill,
        minRank: minSkill?.rank,
        maxRank: maxSkill?.rank,
      });

      if (minSkill && maxSkill) {
        if (maxSkill.rank < minSkill.rank) {
          form.setError("highSkillLevel", {
            type: "manual",
            message:
              "Max skill level must be greater than or equal to min skill level",
          });
        } else {
          form.clearErrors("highSkillLevel");
        }
      }
    } else {
      form.clearErrors("highSkillLevel");
    }
  }, [lowSkillLevel, highSkillLevel, skillLevels, form]);

  useEffect(() => {
    if (
      lowAge !== undefined &&
      highAge !== undefined &&
      lowAge !== null &&
      highAge !== null
    ) {
      if (highAge < lowAge) {
        form.setError("highAge", {
          type: "manual",
          message: "Max age must be greater than or equal to min age",
        });
      } else {
        form.clearErrors("highAge");
      }
    } else {
      form.clearErrors("highAge");
    }
  }, [lowAge, highAge, form]);

  async function onSubmit(values: BracketFormValues) {
    try {
      console.log(values);

      // Map form values to API payload, only including non-null/undefined values
      const payload: any = {
        tournamentId: Number(tournamentId),
        label: values.bracketName,
        eventTypeId: Number(values.teamType),
        bracketFormatId: Number(values.bracketFormat) as 1 | 2 | 3 | 4 | 5 | 6,
      };

      if (values.matchType) {
        payload.defaultScoringPresetId = Number(values.matchType);
      }
      if (values.rrPlayoffType) {
        payload.rrPlayoffFormatId = Number(values.rrPlayoffType) as
          | 1
          | 2
          | 3
          | 4
          | 5
          | 6
          | 7;
      }
      if (values.eliminationScoringPreset) {
        payload.eliminationScoringPresetId = Number(
          values.eliminationScoringPreset
        );
      }
      if (values.medalScoringPreset) {
        payload.medalScoringPresetId = Number(values.medalScoringPreset);
      }
      if (
        values.bracketFeePerPlayer !== undefined &&
        values.bracketFeePerPlayer !== null
      ) {
        payload.bracketFees = values.bracketFeePerPlayer;
      }
      if (values.scheduledStartDate) {
        payload.bracketScheduleDateTime =
          values.scheduledStartDate.toISOString();
      }
      if (values.lowSkillLevel) {
        payload.minSkillLevelId = Number(values.lowSkillLevel);
      }
      if (values.highSkillLevel) {
        payload.maxSkillLevelId = Number(values.highSkillLevel);
      }
      if (values.lowAge !== undefined && values.lowAge !== null) {
        payload.minAge = values.lowAge;
      }
      if (values.highAge !== undefined && values.highAge !== null) {
        payload.maxAge = values.highAge;
      }
      if (values.pools !== undefined && values.pools !== null) {
        payload.pools = values.pools;
      }
      if (values.alternateDescription) {
        payload.alternateDescription = values.alternateDescription;
      }
      if (values.comments) {
        payload.comments = values.comments;
      }
      if (values.enableRegistration !== undefined) {
        payload.enableRegistration = values.enableRegistration;
      }

      console.log("Creating bracket with payload:", payload);

      await createBracket(payload);

      toast.success("Bracket created successfully");
      router.push(`/tournaments/${tournamentId}`);
    } catch (e: any) {
      console.error("Failed to create bracket:", e);
      toast.error(e?.message ?? "Failed to create bracket");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Create Bracket</h1>
            <p className="text-muted-foreground text-sm">
              Fields marked {REQUIRED} are required
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create Bracket"}
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-12 gap-4">
          {/* Bracket Name */}
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="bracketName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bracket Name {REQUIRED}</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bracket name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Team Type (Event Type) */}
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="teamType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Type {REQUIRED}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team type" />
                      </SelectTrigger>
                      <SelectContent className="bg-sidebar">
                        {eventTypes.map((eventType) => (
                          <SelectItem
                            key={eventType.event_type_id}
                            value={String(eventType.event_type_id)}
                          >
                            {eventType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bracket Format */}
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="bracketFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bracket Format {REQUIRED}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bracket format">
                          {field.value && selectedBracketFormatData?.label}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-sidebar">
                        {bracketFormats.map((format) => (
                          <SelectItem
                            key={format.bracket_format_id}
                            value={String(format.bracket_format_id)}
                          >
                            <div className="flex flex-col gap-0.5 py-1">
                              <span className="font-medium">
                                {format.label}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {format.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {selectedBracketFormatData && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedBracketFormatData.description}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Round Robin Playoff Type - Show only for Round Robin formats */}
          {isRoundRobin && (
            <div className="col-span-12 md:col-span-6" key="playoff-type-field">
              <FormField
                control={form.control}
                name="rrPlayoffType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Playoff Type {REQUIRED}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select playoff type">
                            {field.value && selectedPlayoffData?.label}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-sidebar">
                          {rrPlayoffFormats.map((format) => (
                            <SelectItem
                              key={format.rr_playoff_format_id}
                              value={String(format.rr_playoff_format_id)}
                            >
                              <div className="flex flex-col gap-0.5 py-1">
                                <span className="font-medium">
                                  {format.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {format.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {selectedPlayoffData && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedPlayoffData.description}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Default Scoring Preset (Match Type) */}
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="matchType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Scoring Preset {REQUIRED}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scoring preset">
                          {field.value && selectedMatchTypeData?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-sidebar">
                        {scoringPresets.map((preset) => (
                          <SelectItem
                            key={preset.id}
                            value={String(preset.id)}
                          >
                            <div className="flex flex-col gap-0.5 py-1">
                              <span className="font-medium">
                                {preset.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Best of {preset.bestOf}, Game to {preset.gameTo}, Win by {preset.winBy}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {selectedMatchTypeData && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Best of {selectedMatchTypeData.bestOf}, Game to {selectedMatchTypeData.gameTo}, Win by {selectedMatchTypeData.winBy}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Elimination Scoring Preset - Show for elimination brackets or RR with playoffs */}
          {(isDoubleElimination ||
            (isRoundRobin && selectedPlayoffData?.rr_playoff_type !== "NONE")) && (
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name="eliminationScoringPreset"
                  render={({ field }) => {
                    const selectedPreset = scoringPresets.find(p => String(p.id) === field.value);
                    return (
                      <FormItem>
                        <FormLabel>
                          {isRoundRobin ? "Playoff Scoring Preset" : "Elimination Scoring Preset"}
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value || ""}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select scoring preset (optional)">
                                {selectedPreset?.name || "Select scoring preset (optional)"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-sidebar">
                              {scoringPresets.map((preset) => (
                                <SelectItem
                                  key={preset.id}
                                  value={String(preset.id)}
                                >
                                  <div className="flex flex-col gap-0.5 py-1">
                                    <span className="font-medium">
                                      {preset.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      Best of {preset.bestOf}, Game to {preset.gameTo}, Win by {preset.winBy}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {selectedPreset && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Best of {selectedPreset.bestOf}, Game to {selectedPreset.gameTo}, Win by {selectedPreset.winBy}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            )}

          {/* Medal Scoring Preset - Show for Single/Double Elimination */}
          {(isSingleElimination || isDoubleElimination) && (
            <div className="col-span-12 md:col-span-6">
              <FormField
                control={form.control}
                name="medalScoringPreset"
                render={({ field }) => {
                  const selectedPreset = scoringPresets.find(p => String(p.id) === field.value);
                  return (
                    <FormItem>
                      <FormLabel>Medal Scoring Preset</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select scoring preset (optional)">
                              {selectedPreset?.name || "Select scoring preset (optional)"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="bg-sidebar">
                            {scoringPresets.map((preset) => (
                              <SelectItem
                                key={preset.id}
                                value={String(preset.id)}
                              >
                                <div className="flex flex-col gap-0.5 py-1">
                                  <span className="font-medium">
                                    {preset.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    Best of {preset.bestOf}, Game to {preset.gameTo}, Win by {preset.winBy}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {selectedPreset && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Best of {selectedPreset.bestOf}, Game to {selectedPreset.gameTo}, Win by {selectedPreset.winBy}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          )}

          {/* Bracket Fee Per Player */}
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="bracketFeePerPlayer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bracket Fee Per Player {REQUIRED}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 25.00"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : parseFloat(value)
                        );
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Scheduled Start Date & Time */}
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="scheduledStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduled Start Date & Time {REQUIRED}</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={
                        field.value instanceof Date ? field.value : undefined
                      }
                      onChange={(date) => field.onChange(date)}
                      withTime
                      futureOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Low Skill Level */}
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="lowSkillLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Skill Level</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select min skill level" />
                      </SelectTrigger>
                      <SelectContent className="bg-sidebar">
                        {skillLevels.map((skill) => (
                          <SelectItem key={skill.id} value={String(skill.id)}>
                            {skill.skillLabel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* High Skill Level */}
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="highSkillLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Skill Level</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select max skill level" />
                      </SelectTrigger>
                      <SelectContent className="bg-sidebar">
                        {skillLevels.map((skill) => (
                          <SelectItem key={skill.id} value={String(skill.id)}>
                            {skill.skillLabel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Low Age */}
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="lowAge"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>Low Age</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            You may enter a low age and leave the high age blank
                            (e.g. Low Age of 18, High Age blank will display
                            18+) or leave both High/Low blank for All Ages.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="1"
                      placeholder="e.g. 18"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : parseInt(value, 10)
                        );
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* High Age */}
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="highAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>High Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="1"
                      placeholder="e.g. 65"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : parseInt(value, 10)
                        );
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Pools */}
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="pools"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pools</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="1"
                      placeholder="e.g. 4"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : parseInt(value, 10)
                        );
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Alternate Description */}
          <div className="col-span-12">
            <FormField
              control={form.control}
              name="alternateDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter alternate description"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Comments */}
          <div className="col-span-12">
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Enter any additional comments"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Enable Registration */}
          <div className="col-span-12 flex items-center space-x-2 border rounded-md p-3">
            <FormField
              control={form.control}
              name="enableRegistration"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="mb-0 cursor-pointer">
                    Enable Registration
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
