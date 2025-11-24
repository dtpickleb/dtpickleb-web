import { z } from "zod";

export const tournamentFormSchema = z
  .object({
    name: z.string().min(1, "Required").max(200, "Max 200 characters"),
    sportsId: z.number().int().min(1, "Required"), // will be 1(Pickleball) and disabled on UI
    countryId: z.number().int().min(1, "Required"),
    facilityId: z.number().int().min(1, "Required"),

    tournamentFee: z.number().min(0).optional(),
    feeCurrency: z.string().optional(),
    prizeMoney: z.number().min(0).optional(),
    prizeCurrency: z.string().optional(),

    eventStartDate: z.custom<Date | undefined>().optional(),
    eventEndDate: z.custom<Date | undefined>().optional(),
    registrationOpens: z.custom<Date | undefined>().optional(),
    registrationCloses: z.custom<Date | undefined>().optional(),
    cancellationDate: z.custom<Date | undefined>().optional(),

    ballColor: z.string().optional().or(z.literal("").transform(() => undefined)),
    surfaceType: z.string().optional().or(z.literal("").transform(() => undefined)),
    netType: z.string().optional().or(z.literal("").transform(() => undefined)),
    venueType: z.string().optional().or(z.literal("").transform(() => undefined)),

    restTimeMinutes: z.union([
      z.number().min(0, "Must be 0 or greater"),
      z.literal("").transform(() => undefined)
    ]).optional(),
    maxPlayers: z.union([
      z.number().min(0, "Must be 0 or greater"),
      z.literal("").transform(() => undefined)
    ]).optional(),
    duprClubId: z.string().optional().or(z.literal("").transform(() => undefined)),

    requireDuprId: z.boolean().optional(),
    hideBracketStartTimes: z.boolean().optional(),
    isPrivateEvent: z.boolean().optional(),
    playersEnterScores: z.boolean().optional(),
    randomizeFirstChoice: z.boolean().optional(),
    textingEnabled: z.boolean().optional(),

    website: z.union([
      z.string().url("Please enter a valid URL"),
      z.literal("").transform(() => undefined)
    ]).optional(),
    coverImageUrl: z.union([
      z.string().url("Please enter a valid URL"),
      z.literal("").transform(() => undefined)
    ]).optional(),
    flyerPdfUrl: z.union([
      z.string().url("Please enter a valid URL"),
      z.literal("").transform(() => undefined)
    ]).optional(),

    comments: z.string().optional().or(z.literal("").transform(() => undefined)),
    eventDayInstructions: z.string().optional().or(z.literal("").transform(() => undefined)),
    hotelInformation: z.string().optional().or(z.literal("").transform(() => undefined)),
    foodInformation: z.string().optional().or(z.literal("").transform(() => undefined)),
    cancellationRefundPolicy: z.string().optional().or(z.literal("").transform(() => undefined)),
    waiverLiabilityPolicy: z.string().optional().or(z.literal("").transform(() => undefined)),
    covid19Policy: z.string().optional().or(z.literal("").transform(() => undefined)),
  })
  .superRefine((data, ctx) => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    function ensureFuture(name: keyof typeof data, label: string) {
      const d = data[name] as Date | undefined;
      if (d && d < now) {
        ctx.addIssue({ code: "custom", path: [name], message: `${label} must be in the future` });
      }
    }

    function ensureTodayOrFuture(name: keyof typeof data, label: string) {
      const d = data[name] as Date | undefined;
      if (d && d < today) {
        ctx.addIssue({ code: "custom", path: [name], message: `${label} cannot be in the past` });
      }
    }

    ensureFuture("eventStartDate", "Event start");
    ensureFuture("eventEndDate", "Event end");
    ensureTodayOrFuture("registrationOpens", "Registration opens"); // Allow today and future
    ensureFuture("registrationCloses", "Registration closes");
    ensureFuture("cancellationDate", "Cancellation date");

    // Cross-field rules
    const { eventStartDate, eventEndDate, registrationOpens, registrationCloses, cancellationDate } = data;

    if (eventStartDate && eventEndDate && eventEndDate < eventStartDate) {
      ctx.addIssue({ code: "custom", path: ["eventEndDate"], message: "End must be after start" });
    }
    if (registrationOpens && eventStartDate && registrationOpens >= eventStartDate) {
      ctx.addIssue({ code: "custom", path: ["registrationOpens"], message: "Registration opens must be before event start date" });
    }
    if (registrationCloses && eventEndDate && registrationCloses > eventEndDate) {
      ctx.addIssue({ code: "custom", path: ["registrationCloses"], message: "Closes must be on/before event end" });
    }
    if (registrationOpens && registrationCloses && registrationCloses < registrationOpens) {
      ctx.addIssue({ code: "custom", path: ["registrationCloses"], message: "Closes must be after opens" });
    }
    if (registrationCloses && cancellationDate && cancellationDate < registrationCloses) {
      ctx.addIssue({ code: "custom", path: ["cancellationDate"], message: "Cancellation must be after registration closes" });
    }
    if (cancellationDate) {
      if (registrationOpens && cancellationDate < registrationOpens) {
        ctx.addIssue({ code: "custom", path: ["cancellationDate"], message: "Cancellation must be after registration opens" });
      }
      if (eventStartDate && cancellationDate >= eventStartDate) {
        ctx.addIssue({ code: "custom", path: ["cancellationDate"], message: "Cancellation date must be before event start date" });
      }
    }
  });

export type TournamentFormValues = z.infer<typeof tournamentFormSchema>;

export const bracketFormSchema = z.object({
  bracketName: z.string().min(1, "Required"),
  teamType: z.string().min(1, "Required"),
  bracketFormat: z.string().min(1, "Required"),
  rrPlayoffType: z.string().optional().or(z.literal("").transform(() => undefined)),
  matchType: z.string().min(1, "Required"),
  eliminationScoringPreset: z.string().optional().or(z.literal("").transform(() => undefined)),
  medalScoringPreset: z.string().optional().or(z.literal("").transform(() => undefined)),
  bracketFeePerPlayer: z.number({
    error: "Required",
  }).min(0, "Must be 0 or greater"),
  scheduledStartDate: z.date({
    error: "Required",
  }),
  lowSkillLevel: z.string().optional().or(z.literal("").transform(() => undefined)),
  highSkillLevel: z.string().optional().or(z.literal("").transform(() => undefined)),
  lowAge: z.number().min(18, "Must be at least 18").optional(),
  highAge: z.number().min(18, "Must be at least 18").optional(),
  pools: z.number().min(0, "Must be 0 or greater").optional(),
  alternateDescription: z.string().optional().or(z.literal("").transform(() => undefined)),
  comments: z.string().optional().or(z.literal("").transform(() => undefined)),
  enableRegistration: z.boolean().optional(),
}).superRefine((data, ctx) => {
  const now = new Date();

  if (data.scheduledStartDate && data.scheduledStartDate < now) {
    ctx.addIssue({
      code: "custom",
      path: ["scheduledStartDate"],
      message: "Scheduled start date must be in the future"
    });
  }

  if (data.lowAge && data.highAge && data.highAge < data.lowAge) {
    ctx.addIssue({
      code: "custom",
      path: ["highAge"],
      message: "Max age must be greater than or equal to min age"
    });
  }
});

export type BracketFormValues = z.infer<typeof bracketFormSchema>;
