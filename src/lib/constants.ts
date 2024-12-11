export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "French",
  "History",
  "Geography",
  "Computer Science",
  "Music",
  "Art",
] as const;

export const SCHOOL_LEVELS = [
  "Elementary",
  "Middle School",
  "High School",
  "College",
  "Adult Education",
] as const;

export const TEACHING_LOCATIONS = [
  "Teacher's Place",
  "Student's Place",
  "Online",
] as const;

export type Subject = (typeof SUBJECTS)[number];
export type SchoolLevel = (typeof SCHOOL_LEVELS)[number];
export type TeachingLocation = (typeof TEACHING_LOCATIONS)[number];