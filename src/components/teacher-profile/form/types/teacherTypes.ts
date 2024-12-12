export interface TeacherSubject {
  subject_id: string;
  subject: {
    id: string;
    name_en: string;
    name_fr: string;
    name_lb: string;
  };
}

export interface TeacherProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  facebook_profile: string | null;
  show_email: boolean;
  show_phone: boolean;
  show_facebook: boolean;
  bio: string;
  city_id: string;
}

export interface TeacherLocation {
  location_type: string;
  price_per_hour: number;
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
  subjects: string[];
  schoolLevels: string[];
  teachingLocations: string[];
  cityId: string;
  studentRegions: string[];
  studentCities: string[];
  pricePerHour: {
    teacherPlace: string;
    studentPlace: string;
    online: string;
  };
}