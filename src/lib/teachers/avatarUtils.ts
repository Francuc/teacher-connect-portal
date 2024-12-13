import { supabase } from "../supabase";

export const uploadProfilePicture = async (userId: string) => {
  try {
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
    const response = await fetch(avatarUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch avatar');
    }
    const blob = await response.blob();
    const fileName = `${userId}-${Math.random()}.svg`;

    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(fileName, blob, {
        contentType: 'image/svg+xml',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading profile picture:', uploadError);
      throw uploadError;
    }

    return fileName;
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    throw error;
  }
};