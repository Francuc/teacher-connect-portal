export const TEACHING_LOCATIONS = [
  "Teacher's Place",
  "Student's Place",
  "Online",
] as const;

export type TeachingLocation = (typeof TEACHING_LOCATIONS)[number];

// These types will be fetched from Supabase
export type Subject = string;
export type SchoolLevel = string;