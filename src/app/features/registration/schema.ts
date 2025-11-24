import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export const genderOptions = [
  { value: Gender.MALE, label: "Male" },
  { value: Gender.FEMALE, label: "Female" },
  { value: Gender.OTHER, label: "Other" },
];

export const registrationFormSchema = z.object({
  // Step 1: Account Information
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required").optional(), // Email comes from JWT token
  // countryId: z.number().int().min(1, "Required"),
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional(),
  dateOfBirth: z.coerce.date({
    message: "Required",
  }),
  phoneNumber: z
    .string()
    .min(1, "Required")
    .refine((value) => isValidPhoneNumber(value), {
      message: "Invalid phone number",
    }),
  // residenceLocation: z.string().min(1, "Required"),
  // emergencyContactNames: z.array(z.string()).min(1, "At least one emergency contact is required"),
  // emergencyContactPhone: z
  //   .string()
  //   .min(1, "Required")
  //   .refine((value) => isValidPhoneNumber(value), {
  //     message: "Invalid phone number",
  //   }),
  // representingOrganization: z.string().optional(),

  // Step 2: Add Brackets
  bracketIds: z.array(z.number().int().positive()).min(1, "Select at least one bracket"),

  // Step 3: Invite Partner - bracket wise (can be personId for verified members OR email for new invites)
  partnerEmails: z.record(z.string(), z.object({
    personId: z.number().optional(),
    email: z.string().email().optional(),
  }).optional()),
}).superRefine((data, ctx) => {
  // Validate date of birth is in the past and person is at least 10 years old
  const now = new Date();
  const tenYearsAgo = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());

  if (data.dateOfBirth && data.dateOfBirth > now) {
    ctx.addIssue({
      code: "custom",
      path: ["dateOfBirth"],
      message: "Date of birth must be in the past",
    });
  }

  if (data.dateOfBirth && data.dateOfBirth > tenYearsAgo) {
    ctx.addIssue({
      code: "custom",
      path: ["dateOfBirth"],
      message: "You must be at least 10 years old",
    });
  }
});

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;
