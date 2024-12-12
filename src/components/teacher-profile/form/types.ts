import { TeachingLocation } from "@/lib/constants";

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
  subjects: {
    subject: {
      name_en: string;
      name_fr: string;
      name_lb: string;
    };
  }[];
  schoolLevels: string[];
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