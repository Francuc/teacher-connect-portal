import { supabase } from "@/lib/supabase";
import { FormData } from "../types";
import { uploadProfilePicture } from "../../profilePictureUpload";
import { TeacherProfileData } from "../types/profileTypes";

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
        throw new Error('Error uploading profile picture');
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
      city_id: formData.cityId || null,
      updated_at: new Date().toISOString(),
    };

    if (profilePictureUrl) {
      profileData.profile_picture_url = profilePictureUrl;
    }

    // Insert or update profile based on existence
    const { error: profileError } = existingProfile 
      ? await supabase
          .from('teachers')
          .update(profileData)
          .eq('user_id', userId)
      : await supabase
          .from('teachers')
          .insert([profileData]);

    if (profileError) throw profileError;

    return {};
  } catch (error) {
    console.error('Error in handleProfileUpdate:', error);
    return { error: error as Error };
  }
};