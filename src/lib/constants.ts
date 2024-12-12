export const TEACHING_LOCATIONS = [
  "Teacher's Place",
  "Student's Place",
  "Online",
] as const;

export type TeachingLocation = (typeof TEACHING_LOCATIONS)[number];

// These types will be fetched from Supabase
export type Subject = string;
export type SchoolLevel = string;

export interface Region {
  id: string;
  name_en: string;
  name_fr: string;
  name_lb: string;
}

export interface City {
  id: string;
  name_en: string;
  name_fr: string;
  name_lb: string;
  region_id: string;
  region?: Region;
}