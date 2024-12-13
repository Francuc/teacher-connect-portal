import { TeachingLocation } from "@/lib/constants";

export interface TeacherSubject {
  subject_id: string;
  subject: {
    id: string;
    name_en: string;
    name_fr: string;
    name_lb: string;
  };
}

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
  profilePictureUrl?: string;
  subjects: TeacherSubject[];
  schoolLevels: string[];
  teachingLocations: TeachingLocation[];
  cityId: string | null;
  studentRegions: string[];
  studentCities: string[];
  pricePerHour: {
    teacherPlace: string;
    studentPlace: string;
    online: string;
  };
  user_id?: string;
  subscription_status?: string;
  subscription_type?: string;
  subscription_end_date?: string;
  promo_code?: string;
}