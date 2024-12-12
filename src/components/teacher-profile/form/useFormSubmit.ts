import { FormData } from "./types";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

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
      console.error('No userId provided');
      toast({
        title: t("error"),
        description: t("pleaseLoginFirst"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Starting form submission for user:', userId);

    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle(); // Changed from single() to maybeSingle()

      // Prepare basic profile data
      const profileData = {
        user_id: userId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email || '',
        bio: '',
        updated_at: new Date().toISOString(),
      };

      let error;
      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('teachers')
          .update(profileData)
          .eq('user_id', userId);
        error = updateError;
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('teachers')
          .insert([profileData]);
        error = insertError;
      }

      if (error) {
        throw error;
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