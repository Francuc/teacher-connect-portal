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
      const { data: existingProfile, error: checkError } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      // Prepare basic profile data
      const profileData = {
        user_id: userId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email || '',
        bio: '',
        updated_at: new Date().toISOString(),
      };

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
        throw profileError;
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