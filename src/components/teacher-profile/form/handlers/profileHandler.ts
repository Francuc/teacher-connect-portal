import { FormData } from "../types";
import { supabase } from "@/lib/supabase";
import { uploadProfilePicture } from "../../profilePictureUpload";
import { TeacherProfileData } from "../types/profileTypes";

export const handleProfileUpdate = async (
  formData: FormData,
  userId: string,
  isNewProfile: boolean
): Promise<{ error?: Error }> => {
  try {
    console.log('Starting profile update for user:', userId);
    
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
    const profileData: Partial<TeacherProfileData> = {
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

    // Only add profile_picture_url if a new picture was uploaded
    if (profilePictureUrl) {
      profileData.profile_picture_url = profilePictureUrl;
    }

    let updateError;
    if (isNewProfile) {
      console.log('Creating new profile:', profileData);
      const { error } = await supabase
        .from('teachers')
        .insert([profileData]);
      updateError = error;
    } else {
      console.log('Updating existing profile:', profileData);
      const { error } = await supabase
        .from('teachers')
        .update(profileData)
        .eq('user_id', userId);
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