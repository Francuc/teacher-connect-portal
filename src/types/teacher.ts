export interface Teacher {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  facebook_profile?: string;
  show_email: boolean;
  show_phone: boolean;
  show_facebook: boolean;
  bio: string;
  profile_picture_url?: string;
  city_id?: string;
  subscription_status?: string;
  subscription_type?: string;
  subscription_end_date?: string;
  promo_code?: string;
  cities?: any;
  subjects?: any[];
}