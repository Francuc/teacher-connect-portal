import { FormData } from "../types";
import { supabase } from "@/lib/supabase";
import { uploadProfilePicture } from "../profilePictureUpload";

export const handleProfileUpdate = async (
  formData: FormData,
  userId: string,
  isUpdate: boolean
) => {
  console.log('handleProfileUpdate called with:', { userId, isUpdate });

  try {
    let profilePictureUrl = null;
    if (formData.profilePicture) {
      profilePictureUrl = await uploadProfilePicture(formData.profilePicture, userId);
    }

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
      city_id: formData.cityId || null,
      profile_picture_url: profilePictureUrl,
    };

    if (isUpdate) {
      console.log('Updating existing profile for user:', userId);
      const { error } = await supabase
        .from('teachers')
        .update(profileData)
        .eq('user_id', userId);
      
      if (error) throw error;
    } else {
      console.log('Creating new profile for user:', userId);
      const { error } = await supabase
        .from('teachers')
        .insert([profileData]);
      
      if (error) throw error;
    }

    return { error: null };
  } catch (error) {
    console.error('Error in handleProfileUpdate:', error);
    return { error };
  }
};