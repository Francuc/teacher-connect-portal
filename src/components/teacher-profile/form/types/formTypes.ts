export type FormData = {
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
  subjects: Array<{
    subject_id: string;
    subject?: any;
  }>;
  schoolLevels: string[];
  teachingLocations: Array<{
    location_type: string;
    price_per_hour: string;
  }>;
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
};