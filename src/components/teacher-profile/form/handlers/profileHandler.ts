import { FormData } from "../types";
import { supabase } from "@/lib/supabase";

export const handleProfileUpdate = async (
  formData: FormData,
  userId: string,
  isNewProfile: boolean = false
): Promise<{ data?: { id: string }, error?: Error }> => {
  try {
    console.log('Starting profile update for user:', userId);

    // Prepare profile data
    const profileData = {
      user_id: userId,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone || null,
      facebook_profile: formData.facebookProfile || null,
      show_email: formData.showEmail,
      show_phone: formData.showPhone,
      show_facebook: formData.showFacebook,
      bio: formData.bio,
      city_id: formData.cityId,
      profile_picture_url: formData.profilePictureUrl,
      updated_at: new Date().toISOString(),
    };

    if (isNewProfile) {
      console.log('Creating new profile:', profileData);
      const { data, error } = await supabase
        .from('teachers')
        .insert([profileData])
        .select()
        .single();
        
      if (error) throw error;
      return { data: { id: data.id } };
    } else {
      console.log('Updating existing profile:', profileData);
      const { error } = await supabase
        .from('teachers')
        .update(profileData)
        .eq('user_id', userId);
        
      if (error) throw error;
      return { data: { id: userId } };
    }
  } catch (error) {
    console.error('Error in handleProfileUpdate:', error);
    return { error: error as Error };
  }
};

export const handleProfileCreation = async (formData: FormData, userId: string, isNewProfile: boolean = true) => {
  return handleProfileUpdate(formData, userId, isNewProfile);
};