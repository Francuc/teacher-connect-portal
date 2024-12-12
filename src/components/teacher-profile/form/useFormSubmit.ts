import { FormData } from "./types";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { validateForm } from "./validation";
import { uploadProfilePicture } from "./profilePictureUpload";

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
      // Upload profile picture if exists
      let profilePictureUrl = null;
      if (formData.profilePicture) {
        try {
          profilePictureUrl = await uploadProfilePicture(formData.profilePicture, userId);
        } catch (error) {
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
      const { data: existingProfile, error: checkError } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw new Error('Error checking existing profile');
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
        profile_picture_url: profilePictureUrl,
        city_id: formData.cityId,
      };

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('teachers')
          .update(profileData)
          .eq('user_id', userId);
        if (updateError) throw updateError;

        // Delete existing relations
        await Promise.all([
          supabase.from('teacher_subjects').delete().eq('teacher_id', userId),
          supabase.from('teacher_school_levels').delete().eq('teacher_id', userId),
          supabase.from('teacher_locations').delete().eq('teacher_id', userId),
          supabase.from('teacher_student_regions').delete().eq('teacher_id', userId),
          supabase.from('teacher_student_cities').delete().eq('teacher_id', userId)
        ]);
      } else {
        // Insert new profile
        const { error: profileError } = await supabase
          .from('teachers')
          .insert([profileData]);
        if (profileError) throw profileError;
      }

      // Insert new relations
      await Promise.all([
        formData.subjects.length > 0 && supabase
          .from('teacher_subjects')
          .insert(
            formData.subjects.map(subject => ({
              teacher_id: userId,
              subject: subject
            }))
          ),
        formData.schoolLevels.length > 0 && supabase
          .from('teacher_school_levels')
          .insert(
            formData.schoolLevels.map(level => ({
              teacher_id: userId,
              school_level: level
            }))
          ),
        formData.teachingLocations.length > 0 && supabase
          .from('teacher_locations')
          .insert(
            formData.teachingLocations.map(location => ({
              teacher_id: userId,
              location_type: location,
              price_per_hour: parseFloat(formData.pricePerHour[
                location.toLowerCase().replace("'s", "").split(" ")[0] as keyof typeof formData.pricePerHour
              ] || '0')
            }))
          ),
        formData.studentRegions.length > 0 && supabase
          .from('teacher_student_regions')
          .insert(
            formData.studentRegions.map(region => ({
              teacher_id: userId,
              region_name: region
            }))
          ),
        formData.studentCities.length > 0 && supabase
          .from('teacher_student_cities')
          .insert(
            formData.studentCities.map(city => ({
              teacher_id: userId,
              city_name: city
            }))
          )
      ]);

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
        // Add more specific error messages based on the error type
        if (error.message.includes('foreign key constraint')) {
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