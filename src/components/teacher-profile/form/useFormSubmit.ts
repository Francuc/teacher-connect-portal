import { FormData } from "./types";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { validateForm } from "./validation";
import { uploadProfilePicture } from "../profilePictureUpload";
import { handleRelationsUpdate } from "./handlers/relationsUpdateHandler";

export const useFormSubmit = (
  formData: FormData,
  isLoading: boolean,
  setIsLoading: (loading: boolean) => void,
  userId?: string
) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: t("error"),
        description: t("pleaseLoginFirst"),
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    const validationErrors = validateForm(formData, t);
    if (validationErrors.length > 0) {
      toast({
        title: t("error"),
        description: t("pleaseCompleteAllRequiredFields") + ": " + validationErrors.join(", "),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Starting form submission for user:', userId);

    try {
      // Upload profile picture if exists
      let profilePictureUrl = null;
      if (formData.profilePicture) {
        try {
          profilePictureUrl = await uploadProfilePicture(formData.profilePicture, userId);
          console.log('Profile picture uploaded:', profilePictureUrl);
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          toast({
            title: t("error"),
            description: t("errorUploadingProfilePicture"),
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      // Check if profile exists
      console.log('Checking if profile exists for user:', userId);
      const { data: existingProfile, error: checkError } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking profile:', checkError);
        throw checkError;
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
        ...(profilePictureUrl && { profile_picture_url: profilePictureUrl }),
      };

      console.log('Updating/inserting profile with data:', profileData);

      // Update or insert profile
      const { error: profileError } = existingProfile
        ? await supabase
            .from('teachers')
            .update(profileData)
            .eq('user_id', userId)
        : await supabase
            .from('teachers')
            .insert([profileData]);

      if (profileError) {
        console.error('Error updating/inserting profile:', profileError);
        throw profileError;
      }

      // Handle relations update (subjects, locations, etc.)
      const { error: relationsError } = await handleRelationsUpdate(formData, userId);
      
      if (relationsError) {
        throw relationsError;
      }

      // Show success message
      toast({
        title: existingProfile ? t("profileUpdated") : t("profileCreated"),
        description: existingProfile ? t("profileUpdatedDesc") : t("profileCreatedDesc"),
      });
      
      // Navigate to profile view
      navigate(`/profile/${userId}`);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: t("error"),
        description: t("errorSavingProfile"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit };
};