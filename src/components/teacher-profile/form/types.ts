import { type Subject, type SchoolLevel, type TeachingLocation } from "@/lib/constants";

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  facebookProfile: string;
  showEmail: boolean;
  showPhone: boolean;
  showFacebook: boolean;
  bio: string;
  profilePicture: File | null;
  subjects: Subject[];
  schoolLevels: SchoolLevel[];
  teachingLocations: TeachingLocation[];
  cityId: string;
  studentRegions: string[];
  studentCities: string[];
  pricePerHour: {
    teacherPlace: string;
    studentPlace: string;
    online: string;
  };
}