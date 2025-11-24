import { api } from "@/lib/api-client";

export interface EnumOption {
  value: string;
  label: string;
}

export interface AllEnums {
  data: {
    BallColor: EnumOption[];
    Currency: EnumOption[];
    NetType: EnumOption[];
    Role: EnumOption[];
    SurfaceType: EnumOption[];
    VenueType: EnumOption[];
    bracket_type: EnumOption[];
    de_variant: EnumOption[];
    gender_scope: EnumOption[];
    gender_type: EnumOption[];
    match_system: EnumOption[];
    rr_playoff_type: EnumOption[];
    team_member_role: EnumOption[];
    gender: EnumOption[];
  };
}

export const enumsApi = {
  getAll: () => api.get<AllEnums>("/enums/_registry/all?withLabels=true"),
  // Page-specific enum fetchers
  getBallColor: () =>
    api.get<{ data: EnumOption[] }>("/enums/BallColor/options"),
  getCurrency: () => api.get<{ data: EnumOption[] }>("/enums/Currency/options"),
  getNetType: () => api.get<{ data: EnumOption[] }>("/enums/NetType/options"),
  getSurfaceType: () =>
    api.get<{ data: EnumOption[] }>("/enums/SurfaceType/options"),
  getVenueType: () =>
    api.get<{ data: EnumOption[] }>("/enums/VenueType/options"),
};
