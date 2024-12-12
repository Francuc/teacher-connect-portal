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
      
      // For testing: Generate a random UUID for the user_id
      const testUserId = crypto.randomUUID();
      
      console.log('Starting form submission for user:', testUserId);

      // Step 1: Create/Update teacher profile
      const { data: profile, error: profileError } = await handleProfileUpdate(formData, testUserId, true);
      
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
      const { error: relationsError } = await handleRelationsUpdate(formData, profile.id);
      if (relationsError) throw relationsError;

      // Success notification and redirect
      toast({
        title: t("success"),
        description: t("success"),
      });

      // Redirect to profile view using the profile's ID
      navigate(`/profile/${profile.id}`);
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