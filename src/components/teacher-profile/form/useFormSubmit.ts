import { FormData } from "./types";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
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
      // First, check if a profile already exists
      const { data: existingProfile } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', userId)
        .single();

      // Upload profile picture if exists
      let profilePictureUrl = null;
      if (formData.profilePicture) {
        try {
          profilePictureUrl = await uploadProfilePicture(formData.profilePicture, userId);
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          throw new Error(t("errorUploadingProfilePicture"));
        }
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
      };

      // If a profile picture was uploaded, add it to the profile data
      if (profilePictureUrl) {
        profileData.profile_picture_url = profilePictureUrl;
      }

      // Update or insert profile based on existence
      if (existingProfile) {
        const { error: profileError } = await supabase
          .from('teachers')
          .update(profileData)
          .eq('user_id', userId);

        if (profileError) throw profileError;
      } else {
        const { error: profileError } = await supabase
          .from('teachers')
          .insert([profileData]);

        if (profileError) throw profileError;
      }

      // Update subjects
      await supabase
        .from('teacher_subjects')
        .delete()
        .eq('teacher_id', userId);

      if (formData.subjects.length > 0) {
        await supabase
          .from('teacher_subjects')
          .insert(
            formData.subjects.map(subject => ({
              teacher_id: userId,
              subject_id: subject.subject_id
            }))
          );
      }

      // Update school levels
      await supabase
        .from('teacher_school_levels')
        .delete()
        .eq('teacher_id', userId);

      if (formData.schoolLevels.length > 0) {
        await supabase
          .from('teacher_school_levels')
          .insert(
            formData.schoolLevels.map(level => ({
              teacher_id: userId,
              school_level: level
            }))
          );
      }

      // Update teaching locations
      await supabase
        .from('teacher_locations')
        .delete()
        .eq('teacher_id', userId);

      const locationInserts = formData.teachingLocations.map(location => {
        let priceKey: keyof typeof formData.pricePerHour;
        switch (location) {
          case "Teacher's Place":
            priceKey = "teacherPlace";
            break;
          case "Student's Place":
            priceKey = "studentPlace";
            break;
          case "Online":
            priceKey = "online";
            break;
          default:
            priceKey = "online";
        }
        
        return {
          teacher_id: userId,
          location_type: location,
          price_per_hour: parseFloat(formData.pricePerHour[priceKey]) || 0
        };
      });

      if (locationInserts.length > 0) {
        await supabase
          .from('teacher_locations')
          .insert(locationInserts);
      }

      // Update student regions
      await supabase
        .from('teacher_student_regions')
        .delete()
        .eq('teacher_id', userId);

      if (formData.studentRegions.length > 0) {
        await supabase
          .from('teacher_student_regions')
          .insert(
            formData.studentRegions.map(region => ({
              teacher_id: userId,
              region_name: region
            }))
          );
      }

      // Update student cities
      await supabase
        .from('teacher_student_cities')
        .delete()
        .eq('teacher_id', userId);

      if (formData.studentCities.length > 0) {
        await supabase
          .from('teacher_student_cities')
          .insert(
            formData.studentCities.map(city => ({
              teacher_id: userId,
              city_name: city
            }))
          );
      }

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