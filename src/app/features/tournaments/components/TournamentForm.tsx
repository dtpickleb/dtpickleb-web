"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Trophy, Settings } from "lucide-react";
import MultiStepForm from "@/components/MultiStepForm";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Combobox,
  type Option,
} from "@/app/features/tournaments/components/Combobox";
import DateTimePicker from "@/app/features/tournaments/components/DateTimePicker";
import type {
  Country,
  Facility,
  CreateTournamentPayload,
} from "../types";
import { tournamentFormSchema, type TournamentFormValues } from "../schema";
import {
  createTournament,
  updateTournament,
  listCountriesPaged,
  listFacilitiesPaged
} from "../api";
import TipTapEditor from "@/components/editor/Tiptap";
import { enumsApi, type EnumOption } from "@/app/features/enums/api";

const REQUIRED = <span className="text-destructive">*</span>;

// Map helpers
// const mapSports = (c: Sports): Option => ({
//   value: c.id,
//   label: c.name,
// });
const mapCountry = (c: Country): Option => ({
  value: c.id,
  label: c.name,
  sublabel: c.code,
});
const mapFacility = (f: Facility): Option => ({
  value: f.id,
  label: f.venuePark,
  // sublabel: String(f.cityId),
});

// async function fetchSportsOptions({ page, q }: { page: number; q: string }) {
//   const res = await listSportsPaged({ page, limit: 20, q });

//   return {
//     options: res.items.map(mapSports),
//     hasMore: !!res.meta?.totalPages && page < (res.meta.totalPages ?? 1),
//   };
// }

async function fetchCountryOptions({ page, q }: { page: number; q: string }) {
  const res = await listCountriesPaged({ page, limit: 20, q });
  console.log("res", res);

  return {
    options: res.items.map(mapCountry),
    // hasMore: !!res.meta?.totalPages && page < (res.meta.totalPages ?? 1),
    hasMore: false,
  };
}

async function fetchFacilityOptions({ page, q }: { page: number; q: string }) {
  const res = await listFacilitiesPaged({ page, limit: 20, q });
  return {
    options: res.items.map(mapFacility),
    // hasMore: !!res.meta?.totalPages && page < (res.meta.totalPages ?? 1),
    hasMore: false,
  };
}

interface TournamentFormProps {
  mode?: "create" | "edit";
  tournamentId?: string;
  initialData?: any;
  isRegistrationStarted?: boolean;
}

export default function TournamentForm({
  mode = "create",
  tournamentId,
  initialData,
  isRegistrationStarted = false,
}: TournamentFormProps = {}) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const router = useRouter();

  // Fetch enums on component mount
  const [ballColors, setBallColors] = useState<EnumOption[]>([]);
  const [currencies, setCurrencies] = useState<EnumOption[]>([]);
  const [netTypes, setNetTypes] = useState<EnumOption[]>([]);
  const [surfaceTypes, setSurfaceTypes] = useState<EnumOption[]>([]);
  const [venueTypes, setVenueTypes] = useState<EnumOption[]>([]);

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const [
          ballColorRes,
          currencyRes,
          netTypeRes,
          surfaceTypeRes,
          venueTypeRes,
        ] = await Promise.all([
          enumsApi.getBallColor(),
          enumsApi.getCurrency(),
          enumsApi.getNetType(),
          enumsApi.getSurfaceType(),
          enumsApi.getVenueType(),
        ]);

        setBallColors(ballColorRes.data || []);
        setCurrencies(currencyRes.data || []);
        setNetTypes(netTypeRes.data || []);
        setSurfaceTypes(surfaceTypeRes.data || []);
        setVenueTypes(venueTypeRes.data || []);
      } catch (error) {
        console.error("Failed to fetch enums:", error);
        toast.error("Failed to load form options");
      }
    };

    fetchEnums();
  }, []);

  const parseDate = (dateStr?: string | null): Date | undefined => {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    // Check if date is valid
    if (isNaN(date.getTime())) return undefined;
    return date;
  };

  const form = useForm({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues:
      mode === "edit" && initialData
        ? {
          name: initialData.name || "",
          sportsId: initialData.sportsId || 1,
          countryId: initialData.countryId || 0,
          facilityId: initialData.facilityId || 0,
          tournamentFee: initialData.tournamentFee
            ? Number(initialData.tournamentFee)
            : undefined,
          feeCurrency: initialData.feeCurrency || undefined,
          prizeMoney: initialData.prizeMoney
            ? Number(initialData.prizeMoney)
            : undefined,
          prizeCurrency: initialData.prizeCurrency || undefined,
          eventStartDate: parseDate(initialData.eventStartDate),
          eventEndDate: parseDate(initialData.eventEndDate),
          registrationOpens: parseDate(initialData.registrationOpens),
          registrationCloses: parseDate(initialData.registrationCloses),
          cancellationDate: parseDate(initialData.cancellationDate),
          ballColor: initialData.ballColor || undefined,
          surfaceType: initialData.surfaceType || undefined,
          netType: initialData.netType || undefined,
          venueType: initialData.venueType || undefined,
          restTimeMinutes: initialData.restTimeMinutes || undefined,
          maxPlayers: initialData.maxPlayers || undefined,
          duprClubId: initialData.duprClubId || undefined,
          requireDuprId: initialData.requireDuprId || false,
          hideBracketStartTimes: initialData.hideBracketStartTimes || false,
          isPrivateEvent: initialData.isPrivateEvent || false,
          playersEnterScores: initialData.playersEnterScores || false,
          randomizeFirstChoice: initialData.randomizeFirstChoice || false,
          textingEnabled: initialData.textingEnabled || false,
          website: initialData.website || undefined,
          coverImageUrl: initialData.coverImageUrl || undefined,
          flyerPdfUrl: initialData.flyerPdfUrl || undefined,
          comments: initialData.comments || undefined,
          eventDayInstructions: initialData.eventDayInstructions || undefined,
          hotelInformation: initialData.hotelInformation || undefined,
          foodInformation: initialData.foodInformation || undefined,
          cancellationRefundPolicy:
            initialData.cancellationRefundPolicy || undefined,
          waiverLiabilityPolicy:
            initialData.waiverLiabilityPolicy || undefined,
          covid19Policy: initialData.covid19Policy || undefined,
        }
        : {
          name: "",
          sportsId: 1,
          countryId: 1,
          facilityId: 0,
          tournamentFee: undefined,
          feeCurrency: "USD",
          prizeMoney: undefined,
          prizeCurrency: "USD",
          eventStartDate: undefined,
          eventEndDate: undefined,
          registrationOpens: undefined,
          registrationCloses: undefined,
          cancellationDate: undefined,
          ballColor: undefined,
          surfaceType: undefined,
          netType: undefined,
          venueType: undefined,
          restTimeMinutes: undefined,
          maxPlayers: undefined,
          duprClubId: undefined,
          requireDuprId: false,
          hideBracketStartTimes: false,
          isPrivateEvent: false,
          playersEnterScores: false,
          randomizeFirstChoice: false,
          textingEnabled: false,
          website: undefined,
          coverImageUrl: undefined,
          flyerPdfUrl: undefined,
          comments: undefined,
          eventDayInstructions: undefined,
          hotelInformation: undefined,
          foodInformation: undefined,
          cancellationRefundPolicy: undefined,
          waiverLiabilityPolicy: undefined,
          covid19Policy: undefined,
        },
    mode: "onChange",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      // Use setValue instead of reset to avoid transformation issues
      form.setValue("name", initialData.name || "");
      form.setValue("sportsId", initialData.sportsId || 1);
      form.setValue("countryId", initialData.countryId || 0);
      form.setValue("facilityId", initialData.facilityId || 0);
      form.setValue(
        "tournamentFee",
        initialData.tournamentFee
          ? Number(initialData.tournamentFee)
          : undefined
      );
      form.setValue("feeCurrency", initialData.feeCurrency || undefined);
      form.setValue(
        "prizeMoney",
        initialData.prizeMoney ? Number(initialData.prizeMoney) : undefined
      );
      form.setValue("prizeCurrency", initialData.prizeCurrency || undefined);

      // Set date fields individually
      form.setValue(
        "eventStartDate",
        parseDate(initialData.eventStartDate) as any
      );
      form.setValue("eventEndDate", parseDate(initialData.eventEndDate) as any);
      form.setValue(
        "registrationOpens",
        parseDate(initialData.registrationOpens) as any
      );
      form.setValue(
        "registrationCloses",
        parseDate(initialData.registrationCloses) as any
      );
      form.setValue(
        "cancellationDate",
        parseDate(initialData.cancellationDate) as any
      );

      form.setValue("ballColor", initialData.ballColor || undefined);
      form.setValue("surfaceType", initialData.surfaceType || undefined);
      form.setValue("netType", initialData.netType || undefined);
      form.setValue("venueType", initialData.venueType || undefined);
      form.setValue(
        "restTimeMinutes",
        initialData.restTimeMinutes || undefined
      );
      form.setValue("maxPlayers", initialData.maxPlayers || undefined);
      form.setValue("duprClubId", initialData.duprClubId || undefined);
      form.setValue("requireDuprId", initialData.requireDuprId || false);
      form.setValue(
        "hideBracketStartTimes",
        initialData.hideBracketStartTimes || false
      );
      form.setValue("isPrivateEvent", initialData.isPrivateEvent || false);
      form.setValue(
        "playersEnterScores",
        initialData.playersEnterScores || false
      );
      form.setValue(
        "randomizeFirstChoice",
        initialData.randomizeFirstChoice || false
      );
      form.setValue("textingEnabled", initialData.textingEnabled || false);
      form.setValue("website", initialData.website || undefined);
      form.setValue("coverImageUrl", initialData.coverImageUrl || undefined);
      form.setValue("flyerPdfUrl", initialData.flyerPdfUrl || undefined);
      form.setValue("comments", initialData.comments || undefined);
      form.setValue(
        "eventDayInstructions",
        initialData.eventDayInstructions || undefined
      );
      form.setValue(
        "hotelInformation",
        initialData.hotelInformation || undefined
      );
      form.setValue(
        "foodInformation",
        initialData.foodInformation || undefined
      );
      form.setValue(
        "cancellationRefundPolicy",
        initialData.cancellationRefundPolicy || undefined
      );
      form.setValue(
        "waiverLiabilityPolicy",
        initialData.waiverLiabilityPolicy || undefined
      );
      form.setValue("covid19Policy", initialData.covid19Policy || undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, initialData]);

  // ---- Step validation ----
  const validateCurrentStep = async () => {
    switch (currentStep) {
      case 1: // Basic Information
        const step1Valid = await form.trigger([
          "name",
          "countryId",
          "facilityId",
        ]);
        return step1Valid;
      case 2: // Event Details
        const step2Valid = await form.trigger([
          "eventStartDate",
          "eventEndDate",
          "registrationOpens",
          "registrationCloses",
          "cancellationDate",
          "tournamentFee",
          "prizeMoney",
        ]);
        return step2Valid;
      case 3: // Tournament Settings
        const step3Valid = await form.trigger([
          "ballColor",
          "surfaceType",
          "netType",
          "venueType",
          "restTimeMinutes",
          "maxPlayers",
          "duprClubId",
        ]);
        return step3Valid;
      case 4: // Additional Information
        const step4Valid = await form.trigger([
          "website",
          "coverImageUrl",
          "flyerPdfUrl",
          "comments",
          "eventDayInstructions",
          "hotelInformation",
          "foodInformation",
          "cancellationRefundPolicy",
          "waiverLiabilityPolicy",
          "covid19Policy",
        ]);
        return step4Valid;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      console.log("Form errors:", form.formState.errors);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = async (step: number) => {
    // If clicking on a previous step or the same step, allow navigation
    if (step <= currentStep) {
      setCurrentStep(step);
      return;
    }

    // If clicking on a future step, validate all steps up to the target step
    let isValid = true;
    for (let i = currentStep; i < step; i++) {
      const stepValid = await validateStep(i);
      if (!stepValid) {
        isValid = false;
        toast.error(`Please complete step ${i} before proceeding`);
        break;
      }
    }

    if (isValid) {
      setCurrentStep(step);
    }
  };

  // Helper function to validate a specific step
  const validateStep = async (step: number) => {
    switch (step) {
      case 1: // Basic Information
        return await form.trigger(["name", "countryId", "facilityId"]);
      case 2: // Event Details
        return await form.trigger([
          "eventStartDate",
          "eventEndDate",
          "registrationOpens",
          "registrationCloses",
          "cancellationDate",
          "tournamentFee",
          "prizeMoney",
        ]);
      case 3: // Tournament Settings
        return await form.trigger([
          "ballColor",
          "surfaceType",
          "netType",
          "venueType",
          "restTimeMinutes",
          "maxPlayers",
          "duprClubId",
        ]);
      case 4: // Additional Information
        return await form.trigger([
          "website",
          "coverImageUrl",
          "flyerPdfUrl",
          "comments",
          "eventDayInstructions",
          "hotelInformation",
          "foodInformation",
          "cancellationRefundPolicy",
          "waiverLiabilityPolicy",
          "covid19Policy",
        ]);
      default:
        return true;
    }
  };

  // ---- form submit handler ----
  async function onSubmit(values: TournamentFormValues) {
    // Prevent submission if registration has started
    if (mode === "edit" && isRegistrationStarted) {
      toast.error("Cannot update tournament after registration has started");
      return;
    }

    const isFormValid = await form.trigger();
    if (!isFormValid) {
      toast.error("Please fix validation errors before submitting");
      return;
    }

    const toIso = (d?: Date) => (d ? new Date(d).toISOString() : undefined);

    const payload = {
      ...values,
      eventStartDate: toIso(values.eventStartDate),
      eventEndDate: toIso(values.eventEndDate),
      registrationOpens: toIso(values.registrationOpens),
      registrationCloses: toIso(values.registrationCloses),
      cancellationDate: toIso(values.cancellationDate),
    } as CreateTournamentPayload;

    try {
      if (mode === "edit" && tournamentId) {
        const saved = await updateTournament(tournamentId, payload);
        toast.success(`Tournament updated: ${saved.name}`);
        router.push(`/tournaments/${tournamentId}`);
      } else {
        const saved = await createTournament(payload);
        console.log("saved", saved);

        toast.success(`Tournament created: ${saved.name}`);
        form.reset({ ...form.getValues(), name: "" });
        router.push("/tournaments");
      }
    } catch (e: any) {
      toast.error(
        e?.message ??
        `Failed to ${mode === "edit" ? "update" : "create"} tournament`
      );
    }
  }

  const formSteps = [
    {
      title: "Basic Information",
      description: "Enter the essential details about your tournament",
      icon: <Calendar className="w-5 h-5" />,
      content: (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-9">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name {REQUIRED}</FormLabel>
                  <FormControl>
                    <Input placeholder="Tournament name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-3">
            {/* <FormField
              control={form.control}
              name="sportsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sport</FormLabel>
                  <FormControl>
                    <Combobox
                      value={field.value}
                      onChange={(v) => field.onChange(v)}
                      placeholder="Select Sport"
                      remote={{ fetchPage: fetchSportsOptions }}
                    />
                  </FormControl>
                </FormItem>
              )}
            /> */}
            <FormItem>
              <FormLabel>Sport</FormLabel>
              <FormControl>
                <Input
                  placeholder="Select Sport"
                  disabled
                  value={"Pickleball"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country {REQUIRED}</FormLabel>
                  <FormControl>
                    <Combobox
                      value={field.value}
                      onChange={(v) => field.onChange(v)}
                      placeholder="Select country"
                      remote={{ fetchPage: fetchCountryOptions }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="facilityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facility {REQUIRED}</FormLabel>
                  <FormControl>
                    <Combobox
                      value={field.value}
                      onChange={(v) => field.onChange(v)}
                      placeholder="Select facility"
                      remote={{ fetchPage: fetchFacilityOptions }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Event Details",
      description: "Set dates, fees, and venue information",
      icon: <MapPin className="w-5 h-5" />,
      content: (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-3 grid grid-cols-12 gap-1">
            <div className="col-span-7">
              <Controller
                control={form.control}
                name="tournamentFee"
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <label
                      htmlFor="tournamentFee"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Fee
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 25.00"
                      id="tournamentFee"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      onBlur={field.onBlur}
                      name="tournamentFee"
                    />
                    {fieldState.error && (
                      <p className="text-sm font-medium text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="col-span-5">
              <Controller
                control={form.control}
                name="feeCurrency"
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <label
                      htmlFor="feeCurrency"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Currency
                    </label>
                    <Select
                      value={field.value || ""}
                      onValueChange={(val) => field.onChange(val || undefined)}
                      name="feeCurrency"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-sidebar">
                        {currencies?.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <p className="text-sm font-medium text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-3 grid grid-cols-12 gap-1">
            <div className="col-span-7">
              <Controller
                control={form.control}
                name="prizeMoney"
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <label
                      htmlFor="prizeMoney"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Prize
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 500.00"
                      id="prizeMoney"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      onBlur={field.onBlur}
                      name="prizeMoney"
                    />
                    {fieldState.error && (
                      <p className="text-sm font-medium text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="col-span-5">
              <Controller
                control={form.control}
                name="prizeCurrency"
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <label
                      htmlFor="prizeCurrency"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Currency
                    </label>
                    <Select
                      value={field.value || ""}
                      onValueChange={(val) => field.onChange(val || undefined)}
                      name="prizeCurrency"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-sidebar">
                        {currencies?.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <p className="text-sm font-medium text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <FormField
              key={`eventStartDate-${initialData?.id || "new"}`}
              control={form.control}
              name="eventStartDate"
              render={({ field }) => {
                const dateValue = field.value
                  ? field.value instanceof Date
                    ? field.value
                    : new Date(field.value as string)
                  : undefined;
                return (
                  <FormItem>
                    <FormLabel>Event start</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={dateValue}
                        onChange={(date) => field.onChange(date)}
                        withTime
                        futureOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <FormField
              key={`eventEndDate-${initialData?.id || "new"}`}
              control={form.control}
              name="eventEndDate"
              render={({ field }) => {
                const dateValue = field.value
                  ? field.value instanceof Date
                    ? field.value
                    : new Date(field.value as string)
                  : undefined;
                return (
                  <FormItem>
                    <FormLabel>Event end</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={dateValue}
                        onChange={(date) => field.onChange(date)}
                        withTime
                        futureOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="registrationOpens"
              render={({ field }) => {
                const dateValue = field.value
                  ? field.value instanceof Date
                    ? field.value
                    : new Date(field.value as string)
                  : undefined;
                return (
                  <FormItem>
                    <FormLabel>Registration opens</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={dateValue}
                        onChange={(date) => field.onChange(date)}
                        withTime
                        futureOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="registrationCloses"
              render={({ field }) => {
                const dateValue = field.value
                  ? field.value instanceof Date
                    ? field.value
                    : new Date(field.value as string)
                  : undefined;
                return (
                  <FormItem>
                    <FormLabel>Registration closes</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={dateValue}
                        onChange={(date) => field.onChange(date)}
                        withTime
                        futureOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="cancellationDate"
              render={({ field }) => {
                const dateValue = field.value
                  ? field.value instanceof Date
                    ? field.value
                    : new Date(field.value as string)
                  : undefined;
                return (
                  <FormItem>
                    <FormLabel>Cancellation date</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={dateValue}
                        onChange={(date) => field.onChange(date)}
                        withTime
                        futureOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Tournament Settings",
      description: "Configure venue details and tournament rules",
      icon: <Settings className="w-5 h-5" />,
      content: (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-3">
            <FormField
              control={form.control}
              name="ballColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ball color</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={(val) => field.onChange(val || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-sidebar">
                        {ballColors?.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
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
          <div className="col-span-12 md:col-span-3">
            <FormField
              control={form.control}
              name="surfaceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surface type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={(val) => field.onChange(val || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-sidebar">
                        {surfaceTypes?.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
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
          <div className="col-span-12 md:col-span-3">
            <FormField
              control={form.control}
              name="netType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Net type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={(val) => field.onChange(val || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-sidebar">
                        {netTypes?.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
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
          <div className="col-span-12 md:col-span-3">
            <FormField
              control={form.control}
              name="venueType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={(val) => field.onChange(val || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-sidebar">
                        {venueTypes?.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
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
          <div className="col-span-12 md:col-span-3">
            <Controller
              control={form.control}
              name="restTimeMinutes"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label
                    htmlFor="restTimeMinutes"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Rest time (min)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    step="1"
                    placeholder="0"
                    id="restTimeMinutes"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    onBlur={field.onBlur}
                    name="restTimeMinutes"
                  />
                  {fieldState.error && (
                    <p className="text-sm font-medium text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-3">
            <Controller
              control={form.control}
              name="maxPlayers"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label
                    htmlFor="maxPlayers"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Max players
                  </label>
                  <Input
                    type="number"
                    min={0}
                    step="1"
                    placeholder="128"
                    id="maxPlayers"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    onBlur={field.onBlur}
                    name="maxPlayers"
                  />
                  {fieldState.error && (
                    <p className="text-sm font-medium text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Controller
              control={form.control}
              name="duprClubId"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label
                    htmlFor="duprClubId"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    DUPR club ID
                  </label>
                  <Input
                    placeholder="e.g. DUPR12345"
                    id="duprClubId"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name="duprClubId"
                  />
                  {fieldState.error && (
                    <p className="text-sm font-medium text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6 flex items-center justify-between border rounded-md p-3">
            <FormField
              control={form.control}
              name="requireDuprId"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between w-full">
                  <FormLabel className="mb-0">Require DUPR ID</FormLabel>
                  <FormControl>
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6 flex items-center justify-between border rounded-md p-3">
            <FormField
              control={form.control}
              name="hideBracketStartTimes"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between w-full">
                  <FormLabel className="mb-0">
                    Hide bracket start times
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6 flex items-center justify-between border rounded-md p-3">
            <FormField
              control={form.control}
              name="isPrivateEvent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between w-full">
                  <FormLabel className="mb-0">Private event</FormLabel>
                  <FormControl>
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6 flex items-center justify-between border rounded-md p-3">
            <FormField
              control={form.control}
              name="playersEnterScores"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between w-full">
                  <FormLabel className="mb-0">Players enter scores</FormLabel>
                  <FormControl>
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6 flex items-center justify-between border rounded-md p-3">
            <FormField
              control={form.control}
              name="randomizeFirstChoice"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between w-full">
                  <FormLabel className="mb-0">Randomize first choice</FormLabel>
                  <FormControl>
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6 flex items-center justify-between border rounded-md p-3">
            <FormField
              control={form.control}
              name="textingEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between w-full">
                  <FormLabel className="mb-0">Texting enabled</FormLabel>
                  <FormControl>
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Additional Information",
      description: "Optional details and policies",
      icon: <Trophy className="w-5 h-5" />,
      content: (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <Controller
              control={form.control}
              name="website"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label
                    htmlFor="website"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Website
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    autoComplete="off"
                    id="website"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(e.target.value || undefined)
                    }
                    onBlur={field.onBlur}
                    name="website"
                  />
                  {fieldState.error && (
                    <p className="text-sm font-medium text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          <div className="col-span-12">
            <Controller
              control={form.control}
              name="coverImageUrl"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label
                    htmlFor="coverImageUrl"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Cover image URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    autoComplete="off"
                    id="coverImageUrl"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(e.target.value || undefined)
                    }
                    onBlur={field.onBlur}
                    name="coverImageUrl"
                  />
                  {fieldState.error && (
                    <p className="text-sm font-medium text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          <div className="col-span-12">
            <Controller
              control={form.control}
              name="flyerPdfUrl"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label
                    htmlFor="flyerPdfUrl"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Flyer PDF URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    autoComplete="off"
                    id="flyerPdfUrl"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name="flyerPdfUrl"
                  />
                  {fieldState.error && (
                    <p className="text-sm font-medium text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          {(
            [
              ["comments", "Comments / notes"],
              ["eventDayInstructions", "Event-day instructions"],
              ["hotelInformation", "Hotel information"],
              ["foodInformation", "Food information"],
              ["cancellationRefundPolicy", "Cancellation / refund policy"],
              ["waiverLiabilityPolicy", "Waiver / liability policy"],
              ["covid19Policy", "COVID-19 policy"],
            ] as const
          ).map(([name, label]) => (
            <div key={name} className="col-span-12">
              <FormField
                control={form.control}
                name={name as keyof TournamentFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      {/* <Textarea
                        rows={4}
                        placeholder={"add " + label + "..."}
                        {...(field as any)}
                      /> */}
                      <TipTapEditor {...(field as any)} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <fieldset disabled={mode === "edit" && isRegistrationStarted}>
          {/* FORM HEADING */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold">
                {mode === "edit" ? "Edit tournament" : "Create tournament"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {mode === "edit" && isRegistrationStarted
                  ? "This tournament cannot be edited because registration has started"
                  : `Fields marked * are required`}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={mode === "edit" && isRegistrationStarted}
              >
                Reset
              </Button>
            </div>
          </div>

          <Separator />

          {/* MULTI-STEP FORM */}
          <MultiStepForm
            currentStep={currentStep}
            totalSteps={totalSteps}
            steps={formSteps}
            onNext={handleNext}
            onBack={handleBack}
            onSubmit={() => { }}
            isSubmitting={
              form.formState.isSubmitting ||
              (mode === "edit" && isRegistrationStarted)
            }
            stepLabels={["Basic", "Details", "Settings", "Additional"]}
            submitButtonText={
              mode === "edit" ? "Update Tournament" : "Create Tournament"
            }
            showStepCard={false}
            onStepClick={handleStepClick}
          />
        </fieldset>
      </form>
    </Form>
  );
}
