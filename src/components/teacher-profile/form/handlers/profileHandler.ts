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
    const { data: existingProfiles, error: queryError } = await supabase
      .from('teachers')
      .select('email')
      .eq('email', formData.email);

    if (queryError) throw queryError;

    // If email already exists, return an error
    if (existingProfiles && existingProfiles.length > 0) {
      return { error: new Error('emailAlreadyExists') };
    }

    let profilePictureUrl = null;
    if (formData.profilePicture) {
      try {
        profilePictureUrl = await uploadProfilePicture(formData.profilePicture, userId);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        return { error: new Error('errorUploadingProfilePicture') };
      }
    }

    // Prepare profile data for new user
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
      updated_at: new Date().toISOString(),
    };

    // Create new profile
    console.log('Creating new profile for user:', userId);
    const { error: insertError } = await supabase
      .from('teachers')
      .insert([profileData]);

    if (insertError) throw insertError;
    return { error: null };

  } catch (error) {
    console.error('Error in handleProfileUpdate:', error);
    return { error };
  }
};