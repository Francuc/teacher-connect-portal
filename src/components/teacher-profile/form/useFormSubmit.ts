import { FormData } from "./types";
import { handleProfileCreation, handleProfileUpdate } from "./handlers/profileHandler";
import { handleRelationsCreation, handleRelationsUpdate } from "./handlers/relationsHandler";
import { uploadProfilePicture } from "./profilePictureUpload";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const useFormSubmit = (
  formData: FormData,
  isLoading: boolean,
  setIsLoading: (loading: boolean) => void,
  userId: string,
  isNewProfile: boolean,
  onSuccess?: (updatedProfile: any) => void
) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);

      // Handle profile picture upload if there's a new file
      let profilePictureUrl = formData.profilePictureUrl;
      if (formData.profilePicture) {
        profilePictureUrl = await uploadProfilePicture(formData.profilePicture, userId);
      }

      // Create or update the profile
      const profileData = {
        ...formData,
        profile_picture_url: profilePictureUrl
      };

      const profile = isNewProfile
        ? await handleProfileCreation(profileData, userId, true)
        : await handleProfileUpdate(profileData, userId, false);

      // Handle relations (subjects, school levels, locations)
      if (isNewProfile) {
        await handleRelationsCreation(formData, userId);
      } else {
        await handleRelationsUpdate(formData, userId);
      }

      toast({
        title: t("success"),
        description: t(isNewProfile ? "profileCreated" : "profileUpdated"),
      });

      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess(profile);
      }

    } catch (error) {
      console.error('Error submitting form:', error);
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