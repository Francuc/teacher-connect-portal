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
      
      // For testing: Generate a random UUID for new profiles
      const testUserId = isNewProfile ? 
        crypto.randomUUID() : 
        userId;
      
      console.log('Starting form submission for user:', testUserId);

      // Step 1: Create/Update teacher profile
      const { error: profileError } = await handleProfileUpdate(formData, testUserId!, isNewProfile);
      if (profileError) {
        console.error('Profile creation error:', profileError);
        toast({
          title: t("error"),
          description: t("error"),
          variant: "destructive",
        });
        return;
      }

      // Step 2: Update relations (subjects, school levels, locations, etc.)
      const { error: relationsError } = await handleRelationsUpdate(formData, testUserId!);
      if (relationsError) throw relationsError;

      // Success notification and redirect
      toast({
        title: t("success"),
        description: t("success"),
      });

      // Redirect to profile view
      navigate(`/profile/${testUserId}`);
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