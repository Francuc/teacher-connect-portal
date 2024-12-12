import { FormData } from "./types";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { handleProfileUpdate } from "./handlers/profileHandler";
import { handleRelationsUpdate } from "./handlers/relationsHandler";

export const useFormSubmit = (
  formData: FormData,
  isLoading: boolean,
  setIsLoading: (loading: boolean) => void,
  userId?: string,
  isNewProfile: boolean = false
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
    console.log('Starting form submission for user:', userId, 'isNewProfile:', isNewProfile);

    try {
      // Handle profile creation
      const { error: profileError } = await handleProfileUpdate(formData, userId, !isNewProfile);
      
      if (profileError) {
        if (profileError.message === 'emailAlreadyExists') {
          toast({
            title: t("error"),
            description: t("emailAlreadyExists"),
            variant: "destructive",
          });
          return;
        }
        throw profileError;
      }

      // Handle relations update
      const { error: relationsError } = await handleRelationsUpdate(formData, userId);
      if (relationsError) throw relationsError;

      toast({
        title: t("success"),
        description: t("profileSaved"),
      });
      
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