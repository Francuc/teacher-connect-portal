export interface TeacherProfileData {
  user_id: string;
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
  profile_picture_url?: string | null;
  updated_at: string;
}