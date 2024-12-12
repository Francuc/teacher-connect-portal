import { FormData } from "./types";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { validateForm } from "./validation";
import { uploadProfilePicture } from "../profilePictureUpload";

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
    console.log('Starting form submission for user:', userId);

    try {
      // Upload profile picture if exists
      let profilePictureUrl = null;
      if (formData.profilePicture) {
        try {
          profilePictureUrl = await uploadProfilePicture(formData.profilePicture, userId);
          console.log('Profile picture uploaded:', profilePictureUrl);
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
      console.log('Checking if profile exists for user:', userId);
      const { data: existingProfile, error: checkError } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking profile:', checkError);
        throw checkError;
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
        city_id: formData.cityId || null,
        updated_at: new Date().toISOString(),
        ...(profilePictureUrl && { profile_picture_url: profilePictureUrl }),
      };

      console.log('Updating/inserting profile with data:', profileData);

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
        console.error('Error updating/inserting profile:', profileError);
        throw profileError;
      }

      console.log('Profile updated successfully, now handling relations');

      // Delete existing relations
      const deletePromises = [
        supabase.from('teacher_subjects').delete().eq('teacher_id', userId),
        supabase.from('teacher_school_levels').delete().eq('teacher_id', userId),
        supabase.from('teacher_locations').delete().eq('teacher_id', userId),
        supabase.from('teacher_student_regions').delete().eq('teacher_id', userId),
        supabase.from('teacher_student_cities').delete().eq('teacher_id', userId),
      ];

      const deleteResults = await Promise.all(deletePromises);
      console.log('Delete results:', deleteResults);

      // Insert new relations
      const insertPromises = [];

      if (formData.subjects.length > 0) {
        insertPromises.push(
          supabase
            .from('teacher_subjects')
            .insert(formData.subjects.map(subject => ({
              teacher_id: userId,
              subject: subject
            })))
        );
      }

      if (formData.schoolLevels.length > 0) {
        insertPromises.push(
          supabase
            .from('teacher_school_levels')
            .insert(formData.schoolLevels.map(level => ({
              teacher_id: userId,
              school_level: level
            })))
        );
      }

      if (formData.teachingLocations.length > 0) {
        insertPromises.push(
          supabase
            .from('teacher_locations')
            .insert(formData.teachingLocations.map(location => {
              const priceKey = location === "Teacher's Place" 
                ? "teacherPlace" 
                : location === "Student's Place" 
                  ? "studentPlace" 
                  : "online";
              
              return {
                teacher_id: userId,
                location_type: location,
                price_per_hour: parseFloat(formData.pricePerHour[priceKey]) || 0
              };
            }))
        );
      }

      if (formData.studentRegions.length > 0) {
        insertPromises.push(
          supabase
            .from('teacher_student_regions')
            .insert(formData.studentRegions.map(region => ({
              teacher_id: userId,
              region_name: region
            })))
        );
      }

      if (formData.studentCities.length > 0) {
        insertPromises.push(
          supabase
            .from('teacher_student_cities')
            .insert(formData.studentCities.map(city => ({
              teacher_id: userId,
              city_name: city
            })))
        );
      }

      const insertResults = await Promise.all(insertPromises);
      console.log('Insert results:', insertResults);

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