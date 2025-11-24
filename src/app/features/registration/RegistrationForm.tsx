"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { User, ListCheck, UserPlus, Info } from "lucide-react";
import MultiStepForm from "@/components/MultiStepForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { PartnerInviteCard } from "./components/PartnerInviteCard";
// import { TagInput } from "@/components/ui/tag-input";
// import {
//   Combobox,
//   type Option,
// } from "@/app/features/tournaments/components/Combobox";
import DateTimePicker from "@/app/features/tournaments/components/DateTimePicker";
import { genderOptions } from "./schema";
import { registrationFormSchema, type RegistrationFormValues } from "./schema";
import {
  registerPlayer,
  fetchTournamentBrackets
} from "./api";
// import { listCountriesPaged } from "../tournaments/api";
// import type { Country } from "../tournaments/types";
import type { TournamentBracket, PlayerProfile } from "./types";

const REQUIRED = <span className="text-destructive">*</span>;

// // Map helpers
// const mapCountry = (c: Country): Option => ({
//   value: c.id,
//   label: c.name,
//   sublabel: c.code,
// });

// async function fetchCountryOptions({ page, q }: { page: number; q: string }) {
//   const res = await listCountriesPaged({ page, limit: 20, q });

//   return {
//     options: res.items.map(mapCountry),
//     hasMore: !!res.meta?.totalPages && page < (res.meta.totalPages ?? 1),
//   };
// }

export default function RegistrationForm({
  userName = "Player",
  playerProfile = null,
}: {
  userName?: string;
  playerProfile?: PlayerProfile | null;
}) {
  const router = useRouter();
  const params = useParams();
  const [brackets, setBrackets] = useState<TournamentBracket[]>([]);
  const [isLoadingBrackets, setIsLoadingBrackets] = useState(true);

  // Calculate total steps based on profile completion
  const totalSteps = playerProfile?.isProfileCompleted ? 2 : 3;
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      firstName: playerProfile?.firstName || "",
      lastName: playerProfile?.lastName || "",
      email: playerProfile?.email || "",
      // countryId: 0,
      gender: (playerProfile?.gender as any) || undefined,
      dateOfBirth: playerProfile?.dateOfBirth
        ? new Date(playerProfile.dateOfBirth)
        : undefined,
      phoneNumber: playerProfile?.phone || "",
      // residenceLocation: "",
      // emergencyContactNames: [],
      // emergencyContactPhone: "",
      // representingOrganization: "",
      bracketIds: [],
      partnerEmails: {},
    },
    mode: "onChange",
  });

  // Fetch brackets on mount
  useEffect(() => {
    async function loadBrackets() {
      try {
        setIsLoadingBrackets(true);
        const data = await fetchTournamentBrackets(Number(params.id));

        setBrackets(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Failed to load brackets");
        console.error(error);
        setBrackets([]); // Set empty array on error
      } finally {
        setIsLoadingBrackets(false);
      }
    }

    if (params.id) {
      loadBrackets();
    }
  }, [params.id]);

  // ---- Step validation ----
  const validateCurrentStep = async () => {
    switch (currentStep) {
      case 1: // Account Information
        const step1Valid = await form.trigger([
          "firstName",
          "lastName",
          // "countryId",
          "gender",
          "dateOfBirth",
          "phoneNumber",
          // "residenceLocation",
          // "emergencyContactNames",
          // "emergencyContactPhone",
        ]);
        return step1Valid;
      case 2: // Add Brackets
        const step2Valid = await form.trigger(["bracketIds"]);
        return step2Valid;
      case 3: // Invite Partner
        return true;
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
      case 1: // Account Information (only if profile not completed)
        if (!playerProfile?.isProfileCompleted) {
          return await form.trigger([
            "firstName",
            "lastName",
            "gender",
            "dateOfBirth",
            "phoneNumber",
          ]);
        }
        return true;
      case 2: // Add Brackets (this is step 2 if profile completed, or could be different)
        const bracketsStepNum = playerProfile?.isProfileCompleted ? 1 : 2;
        if (step === bracketsStepNum) {
          return await form.trigger(["bracketIds"]);
        }
        return true;
      case 3: // Invite Partner
        return true; // No required fields in partner invite step
      default:
        return true;
    }
  };

  // ---- form submit handler ----
  async function onSubmit(values: RegistrationFormValues) {
    const isFormValid = await form.trigger();
    if (!isFormValid) {
      toast.error("Please fix validation errors before submitting");
      return;
    }

    try {
      await registerPlayer({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email ?? "",
        phone: values.phoneNumber,
        gender: values.gender ?? "",
        dateOfBirth: values.dateOfBirth.toISOString().split("T")[0],
        tournamentBracketIds: values.bracketIds.map((id) => {
          const partnerData = values.partnerEmails?.[id.toString()];
          return {
            bracketId: id,
            ...(partnerData?.personId && { teamPersonId: partnerData.personId }),
            ...(partnerData?.email && { playerEmailAddress: partnerData.email }),
          };
        }),
      });
      toast.success("Registration successful!");
      router.push(`/tournaments/${params.id}`);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to register");
    }
  }

  const selectedBrackets = Array.isArray(brackets)
    ? brackets.filter((b) =>
      form.watch("bracketIds").includes(b.tournament_bracket_id)
    )
    : [];

  const accountInfoStep = {
    title: "Account Information",
    description: `You are registering as ${userName}.`,
    icon: <User className="w-5 h-5" />,
    content: (
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name {REQUIRED}</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name {REQUIRED}</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Email is now taken from JWT token, not shown in form */}
        {/* <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    What country do you reside in? {REQUIRED}
                  </FormLabel>
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
          </div> */}
        <div className="col-span-12 md:col-span-6">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender {REQUIRED}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-sidebar">
                      {genderOptions.map((o) => (
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
        <div className="col-span-12 md:col-span-6">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth (e.g. 2/23/1965) {REQUIRED}</FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={
                      field.value instanceof Date ? field.value : undefined
                    }
                    onChange={(date) => field.onChange(date)}
                    withTime={false}
                    futureOnly={false}
                    placeholder="Select date of birth"
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
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Phone Number {REQUIRED}</FormLabel>
                <FormControl>
                  <PhoneInput
                    value={field.value}
                    onChange={(v) => field.onChange(v || "")}
                    placeholder="2015550123"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* <div className="col-span-12">
            <FormField
              control={form.control}
              name="residenceLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Where do you reside? {REQUIRED}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type the name of the location"
                      {...field}
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
              name="emergencyContactNames"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Name {REQUIRED}</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="ross, joey, chandler"
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
              name="emergencyContactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Phone {REQUIRED}</FormLabel>
                  <FormControl>
                    <PhoneInput
                      value={field.value}
                      onChange={(v) => field.onChange(v || "")}
                      placeholder="2015550124"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12">
            <FormField
              control={form.control}
              name="representingOrganization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Representing Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="Club name or sponsorship" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
        <div className="col-span-12">
          <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20 p-4">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {` Each player must register themself first. After you've registered,
              then you will invite your partner to join you.`}
            </p>
          </div>
        </div>
      </div>
    ),
  };

  const addBracketsStep = {
    title: "Add Brackets",
    description: isLoadingBrackets
      ? "Loading brackets..."
      : `Showing ${brackets.length} eligible bracket${brackets.length !== 1 ? 's' : ''}`,
    icon: <ListCheck className="w-5 h-5" />,
    content: (
      <div className="space-y-4">
        <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 p-3">
          <Info className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              Brackets filtered for you
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              Only showing brackets that match your age, gender, and skill level from your profile
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20 p-3">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-800 dark:text-blue-200">
            Selected brackets must be different dates/times or match formats
          </p>
        </div>

        {isLoadingBrackets ? (
          <div className="text-center py-8">Loading brackets...</div>
        ) : brackets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No brackets available for this tournament
          </div>
        ) : (
          <FormField
            control={form.control}
            name="bracketIds"
            render={() => (
              <FormItem>
                <div className="space-y-2">
                  {brackets.map((bracket) => (
                    <FormField
                      key={bracket.tournament_bracket_id}
                      control={form.control}
                      name="bracketIds"
                      render={({ field }) => {
                        const fee =
                          bracket.event_fee_override_cents ??
                          bracket.event_type?.default_event_fee_cents;
                        const feeDisplay =
                          fee > 0
                            ? `$${(fee / 100).toFixed(2)}/person`
                            : "Free";
                        const dateDisplay = bracket.bracket_start_date_time
                          ? new Date(
                            bracket.bracket_start_date_time
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })
                          : "TBD";

                        // Build eligibility info
                        const ageRange = [];
                        if (bracket.min_age && bracket.max_age) {
                          ageRange.push(`${bracket.min_age}-${bracket.max_age} years`);
                        } else if (bracket.min_age) {
                          ageRange.push(`${bracket.min_age}+ years`);
                        } else if (bracket.max_age) {
                          ageRange.push(`Under ${bracket.max_age} years`);
                        }

                        const genderScope = bracket.event_type?.gender_scope;
                        const genderLabel = genderScope === 'OPEN' ? 'Open' :
                          genderScope === 'MEN' ? 'Men' :
                            genderScope === 'WOMEN' ? 'Women' :
                              genderScope === 'MIXED' ? 'Mixed' : null;

                        return (
                          <FormItem
                            key={bracket.tournament_bracket_id}
                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(
                                  bracket.tournament_bracket_id
                                )}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                      ...field.value,
                                      bracket.tournament_bracket_id,
                                    ])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value) =>
                                          value !==
                                          bracket.tournament_bracket_id
                                      )
                                    );
                                }}
                              />
                            </FormControl>
                            <div className="flex-1 space-y-2 leading-none">
                              <div>
                                <FormLabel className="text-base font-semibold cursor-pointer">
                                  {bracket?.label}
                                </FormLabel>
                                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                  <span className="text-xs font-medium text-primary">
                                    {bracket?.event_type?.label}
                                  </span>
                                  {genderLabel && (
                                    <span className="inline-flex items-center text-xs px-2 py-0.5 bg-secondary rounded-full">
                                      {genderLabel}
                                    </span>
                                  )}
                                  {ageRange.length > 0 && (
                                    <span className="inline-flex items-center text-xs px-2 py-0.5 bg-secondary rounded-full">
                                      {ageRange[0]}
                                    </span>
                                  )}
                                  <span className="inline-flex items-center text-xs px-2 py-0.5 bg-accent rounded-full capitalize">
                                    {bracket?.match_system?.replace(/_/g, ' ').toLowerCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>📅 {dateDisplay}</span>
                                <span>•</span>
                                <span className="font-medium">{feeDisplay}</span>
                              </div>
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    ),
  };

  const invitePartnerStep = {
    title: "Invite Partner",
    description:
      "Review your registration and invite partners for each bracket",
    icon: <UserPlus className="w-5 h-5" />,
    content: (
      <div className="space-y-6">
        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20 p-4">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {`Don't have a partner yet?`}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Click continue to register as a Player Needing a Partner. You can
              also invite your partner after you complete registration.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Registering for</h3>
          <div className="space-y-4">
            {selectedBrackets.map((bracket) => {
              const fee =
                bracket.event_fee_override_cents ??
                bracket.event_type?.default_event_fee_cents ?? 0;
              const dateDisplay = bracket.bracket_start_date_time
                ? new Date(bracket.bracket_start_date_time).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  }
                )
                : "TBD";

              return (
                <PartnerInviteCard
                  key={bracket.tournament_bracket_id}
                  bracketId={bracket.tournament_bracket_id}
                  bracketLabel={bracket.label}
                  eventTypeLabel={bracket.event_type?.label}
                  fee={fee}
                  dateDisplay={dateDisplay}
                  onInvite={(data) => {
                    // Store invitation data in form state for submission
                    form.setValue(`partnerEmails.${data.bracketId}` as any, {
                      personId: data.personId,
                      email: data.email,
                    });
                  }}
                />
              );
            })}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Partner fees not included. Partner invites will be sent upon
          completion of registration.
        </p>
      </div>
    ),
  };

  const formSteps = playerProfile?.isProfileCompleted
    ? [addBracketsStep, invitePartnerStep]
    : [accountInfoStep, addBracketsStep, invitePartnerStep];

  const stepLabels = playerProfile?.isProfileCompleted
    ? ["Brackets", "Partner"]
    : ["Account Info", "Brackets", "Partner"];

  const bracketsStepNumber = playerProfile?.isProfileCompleted ? 1 : 2;
  const isOnBracketsStep = currentStep === bracketsStepNumber;
  const shouldDisableNext =
    isOnBracketsStep && !isLoadingBrackets && brackets.length === 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* MULTI-STEP FORM */}
        <MultiStepForm
          currentStep={currentStep}
          totalSteps={totalSteps}
          steps={formSteps}
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={() => { }}
          isSubmitting={form.formState.isSubmitting}
          stepLabels={stepLabels}
          submitButtonText={
            currentStep === totalSteps ? "Register" : "Continue"
          }
          showStepCard={true}
          disableNext={shouldDisableNext}
          onStepClick={handleStepClick}
        />
      </form>
    </Form>
  );
}
