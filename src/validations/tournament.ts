export interface Step1Data {
  name: string;
  description: string;
  date: string;
  endDate?: string;
  registrationDeadline: string;
}

export interface Step2Data {
  venueId?: string;
  customVenue?: string;
  customAddress?: string;
  city?: string;
  state: string;
}

export interface Step3Data {
  formats: string[];
  skillLevels: string[];
  entryFee: number;
  maxParticipants: number;
}

export interface Step4Data {
  tournamentFormat: string;
  prizes?: string;
  rules?: string;
}

export interface TournamentFormData extends Step1Data, Step2Data, Step3Data, Step4Data {}

export const step1Validation = (data: Partial<Step1Data>): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) {
    errors.name = "Tournament name is required";
  }

  if (!data.description?.trim()) {
    errors.description = "Description is required";
  }

  if (!data.date) {
    errors.date = "Start date is required";
  }

  if (data.endDate && data.date && new Date(data.endDate) < new Date(data.date)) {
    errors.endDate = "End date must be after start date";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const step2Validation = (data: Partial<Step2Data>): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.venueId && !data.customVenue) {
    errors.venue = "Please select a venue or provide custom venue details";
  }

  if (!data.venueId && data.customVenue && !data.customAddress) {
    errors.customAddress = "Street address is required for custom venue";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const step3Validation = (data: Partial<Step3Data>): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.formats || data.formats.length === 0) {
    errors.formats = "At least one tournament format is required";
  }

  if (!data.skillLevels || data.skillLevels.length === 0) {
    errors.skillLevels = "At least one skill level is required";
  }

  if (!data.maxParticipants || data.maxParticipants < 8) {
    errors.maxParticipants = "Minimum 8 participants required";
  }

  if (data.entryFee && data.entryFee < 0) {
    errors.entryFee = "Entry fee cannot be negative";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const step4Validation = (data: Partial<Step4Data>): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.tournamentFormat) {
    errors.tournamentFormat = "Tournament format is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAllSteps = (data: Partial<TournamentFormData>) => {
  const step1Result = step1Validation(data);
  const step2Result = step2Validation(data);
  const step3Result = step3Validation(data);
  const step4Result = step4Validation(data);

  return {
    isValid: step1Result.isValid && step2Result.isValid && step3Result.isValid && step4Result.isValid,
    stepErrors: {
      step1: step1Result.errors,
      step2: step2Result.errors,
      step3: step3Result.errors,
      step4: step4Result.errors
    }
  };
};