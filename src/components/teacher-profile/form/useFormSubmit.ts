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
          console.error('Error uploading profile picture:', error);
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

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing profile:', checkError);
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
        city_id: formData.cityId,
        updated_at: new Date().toISOString(),
      };

      // Only update profile_picture_url if a new picture was uploaded
      if (profilePictureUrl) {
        profileData.profile_picture_url = profilePictureUrl;
      }

      let updateError;
      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('teachers')
          .update(profileData)
          .eq('user_id', userId);
        updateError = error;
      } else {
        // Insert new profile
        const { error } = await supabase
          .from('teachers')
          .insert([profileData]);
        updateError = error;
      }

      if (updateError) {
        console.error('Error updating/inserting profile:', updateError);
        throw updateError;
      }

      // Delete existing relations
      const deletePromises = [
        supabase.from('teacher_subjects').delete().eq('teacher_id', userId),
        supabase.from('teacher_school_levels').delete().eq('teacher_id', userId),
        supabase.from('teacher_locations').delete().eq('teacher_id', userId),
        supabase.from('teacher_student_regions').delete().eq('teacher_id', userId),
        supabase.from('teacher_student_cities').delete().eq('teacher_id', userId)
      ];

      const deleteResults = await Promise.all(deletePromises);
      const deleteErrors = deleteResults.filter(result => result.error);
      if (deleteErrors.length > 0) {
        console.error('Error deleting existing relations:', deleteErrors);
        throw new Error('Error deleting existing relations');
      }

      // Insert new relations
      const insertPromises = [];

      if (formData.subjects.length > 0) {
        insertPromises.push(
          supabase
            .from('teacher_subjects')
            .insert(
              formData.subjects.map(subject => ({
                teacher_id: userId,
                subject: subject
              }))
            )
        );
      }

      if (formData.schoolLevels.length > 0) {
        insertPromises.push(
          supabase
            .from('teacher_school_levels')
            .insert(
              formData.schoolLevels.map(level => ({
                teacher_id: userId,
                school_level: level
              }))
            )
        );
      }

      if (formData.teachingLocations.length > 0) {
        insertPromises.push(
          supabase
            .from('teacher_locations')
            .insert(
              formData.teachingLocations.map(location => ({
                teacher_id: userId,
                location_type: location,
                price_per_hour: parseFloat(formData.pricePerHour[
                  location.toLowerCase().replace("'s", "").split(" ")[0] as keyof typeof formData.pricePerHour
                ] || '0')
              }))
            )
        );
      }

      if (formData.studentRegions.length > 0) {
        insertPromises.push(
          supabase
            .from('teacher_student_regions')
            .insert(
              formData.studentRegions.map(region => ({
                teacher_id: userId,
                region_name: region
              }))
            )
        );
      }

      if (formData.studentCities.length > 0) {
        insertPromises.push(
          supabase
            .from('teacher_student_cities')
            .insert(
              formData.studentCities.map(city => ({
                teacher_id: userId,
                city_name: city
              }))
            )
        );
      }

      const insertResults = await Promise.all(insertPromises);
      const insertErrors = insertResults.filter(result => result.error);
      if (insertErrors.length > 0) {
        console.error('Error inserting new relations:', insertErrors);
        throw new Error('Error inserting new relations');
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