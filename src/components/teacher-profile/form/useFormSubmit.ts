import { FormData } from "./types";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { validateForm } from "./validation";
import { handleProfileUpdate } from "./handlers/profileUpdateHandler";
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

    try {
      // Check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing profile:', checkError);
        throw new Error('Error checking existing profile');
      }

      // Update profile
      const profileResult = await handleProfileUpdate(formData, userId, !!existingProfile);
      if (profileResult.error) {
        throw profileResult.error;
      }

      // Update relations
      const relationsResult = await handleRelationsUpdate(formData, userId);
      if (relationsResult.error) {
        throw relationsResult.error;
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
      let errorMessage = t("errorSavingProfile");
      
      if (error instanceof Error) {
        if (error.message === 'errorUploadingProfilePicture') {
          errorMessage = t("errorUploadingProfilePicture");
        } else if (error.message.includes('foreign key constraint')) {
          errorMessage = t("errorInvalidReference");
        } else if (error.message.includes('duplicate key')) {
          errorMessage = t("errorDuplicateEntry");
        }
      }
      
      toast({
        title: t("error"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit };
};