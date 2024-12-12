import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { validateForm } from "./validation";
import { FormData } from "./types";
import { handleProfileUpdate } from "./handlers/profileUpdateHandler";
import { handleProfileCreate } from "./handlers/profileHandler";
import { handleRelationsUpdate } from "./handlers/relationsUpdateHandler";

export const useFormSubmit = (
  formData: FormData,
  isLoading: boolean,
  setIsLoading: (loading: boolean) => void,
  userId: string,
  isNewProfile: boolean
) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validationErrors = validateForm(formData, t);
    
    if (validationErrors.length > 0) {
      toast({
        title: t("error"),
        description: validationErrors.join(", "),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Starting form submission for profile:", userId);

      if (isNewProfile) {
        const result = await handleProfileCreate(userId, formData);
        if (result.error) throw result.error;
      } else {
        const result = await handleProfileUpdate(userId, formData);
        if (result.error) throw result.error;
      }

      await handleRelationsUpdate(formData, userId);

      toast({
        title: t("success"),
        description: isNewProfile ? t("profileCreated") : t("profileUpdated"),
      });

      // Redirect to profile view
      window.location.href = `/profile/${userId}`;
    } catch (error) {
      console.error("Error submitting form:", error);
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