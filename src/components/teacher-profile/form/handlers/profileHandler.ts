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
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('teachers')
      .select('id')
      .eq('user_id', userId)
      .single();

    let profilePictureUrl = null;
    if (formData.profilePicture) {
      try {
        profilePictureUrl = await uploadProfilePicture(formData.profilePicture, userId);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        return { error: new Error('errorUploadingProfilePicture') };
      }
    }

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
      city_id: formData.cityId || null,
      updated_at: new Date().toISOString(),
    };

    // Add profile picture URL only if a new one was uploaded
    if (profilePictureUrl) {
      profileData.profile_picture_url = profilePictureUrl;
    }

    let result;
    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from('teachers')
        .update(profileData)
        .eq('user_id', userId);
    } else {
      // Create new profile
      result = await supabase
        .from('teachers')
        .insert([profileData]);
    }

    if (result.error) throw result.error;
    return { error: null };

  } catch (error) {
    console.error('Error in handleProfileUpdate:', error);
    return { error };
  }
};