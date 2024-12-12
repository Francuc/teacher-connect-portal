import { supabase } from "@/lib/supabase";

export const uploadProfilePicture = async (file: File, userId: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('profile-pictures')
      .upload(fileName, file, {
        upsert: true // Allow overwriting existing files
      });
    
    if (uploadError) {
      throw uploadError;
    }

    return data.path;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw new Error('Failed to upload profile picture');
  }
};