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
    // Check if a profile already exists with this email
    const { data: existingProfile } = await supabase
      .from('teachers')
      .select('user_id, email')
      .eq('email', formData.email)
      .single();

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

    // Only update if we're editing an existing profile (same email and user_id)
    if (existingProfile && existingProfile.user_id === userId) {
      console.log('Updating existing profile for user:', userId);
      const { error } = await supabase
        .from('teachers')
        .update(profileData)
        .eq('user_id', userId);
      
      if (error) throw error;
    } else {
      // Create new profile if email doesn't exist or belongs to another user
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