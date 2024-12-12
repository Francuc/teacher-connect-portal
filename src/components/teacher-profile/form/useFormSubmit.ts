import { FormData } from "./types";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { handleProfileUpdate } from "./handlers/profileHandler";
import { handleRelationsUpdate } from "./handlers/relationsHandler";

export const useFormSubmit = (
  formData: FormData,
  isLoading: boolean,
  setIsLoading: (loading: boolean) => void,
  userId: string | null,
  isNewProfile: boolean = false
) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Generate a random UUID for new profiles
      const profileId = userId || crypto.randomUUID();
      
      console.log('Starting form submission for profile:', profileId);

      // Step 1: Create/Update teacher profile
      const { data: profile, error: profileError } = await handleProfileUpdate(formData, profileId, isNewProfile);
      
      if (profileError) {
        console.error('Profile creation error:', profileError);
        toast({
          title: t("error"),
          description: t("error"),
          variant: "destructive",
        });
        return;
      }

      if (!profile?.id) {
        throw new Error('No profile ID returned from creation');
      }

      // Step 2: Update relations using the profile's ID
      const { error: relationsError } = await handleRelationsUpdate(formData, profileId);
      if (relationsError) throw relationsError;

      // Success notification and redirect
      toast({
        title: t("success"),
        description: t("success"),
      });

      // Redirect to profile view
      navigate(`/profile/${profileId}`);
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: t("error"),
        description: t("error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit };
};