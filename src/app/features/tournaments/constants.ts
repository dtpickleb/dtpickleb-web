export enum Currency {
  USD = "USD",
  // add more when needed
}

export enum BallColor {
  YELLOW = "YELLOW",
  ORANGE = "ORANGE",
  GREEN = "GREEN",
  WHITE = "WHITE",
  PINK = "PINK",
  BLUE = "BLUE",
  RED = "RED",
  OTHER = "OTHER",
}

export enum SurfaceType {
  ASPHALT = "ASPHALT",
  CONCRETE = "CONCRETE",
  ACRYLIC = "ACRYLIC",
  WOOD = "WOOD",
  SPORT_COURT = "SPORT_COURT",
  OTHER = "OTHER",
}

export enum NetType {
  PORTABLE = "PORTABLE",
  PERMANENT = "PERMANENT",
  OTHER = "OTHER",
}

export enum VenueType {
  INDOOR = "INDOOR",
  OUTDOOR = "OUTDOOR",
  OTHER = "OTHER",
}

// UI option helpers
export const currencyOptions = Object.values(Currency).map(v => ({ value: v, label: v }));
export const ballColorOptions = Object.values(BallColor).map(v => ({ value: v, label: v.replaceAll("_", " ") }));
export const surfaceTypeOptions = Object.values(SurfaceType).map(v => ({ value: v, label: v.replaceAll("_", " ") }));
export const netTypeOptions = Object.values(NetType).map(v => ({ value: v, label: v.replaceAll("_", " ") }));
export const venueTypeOptions = Object.values(VenueType).map(v => ({ value: v, label: v.replaceAll("_", " ") }));
