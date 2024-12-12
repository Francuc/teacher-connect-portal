import { supabase } from "@/lib/supabase";
import { TeacherProfileData } from "../types/profileTypes";
import { uploadProfilePicture } from "../profilePictureUpload";
import { FormData } from "../types";

export const handleProfileUpdate = async (
  formData: FormData,
  userId: string,
  existingProfile: boolean
): Promise<{ error?: Error }> => {
  try {
    // Upload profile picture if exists
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
    const profileData: TeacherProfileData = {
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
      updated_at: new Date().toISOString(),
    };

    // Only update profile_picture_url if a new picture was uploaded
    if (profilePictureUrl) {
      profileData.profile_picture_url = profilePictureUrl;
    }

    let updateError;
    if (existingProfile) {
      const { error } = await supabase
        .from('teachers')
        .update(profileData)
        .eq('user_id', userId);
      updateError = error;
    } else {
      const { error } = await supabase
        .from('teachers')
        .insert([profileData]);
      updateError = error;
    }

    if (updateError) {
      console.error('Error updating/inserting profile:', updateError);
      throw updateError;
    }

    return {};
  } catch (error) {
    console.error('Error in handleProfileUpdate:', error);
    return { error: error as Error };
  }
};