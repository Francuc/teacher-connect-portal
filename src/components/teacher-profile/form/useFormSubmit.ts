import { FormData } from "./types";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.bio || 
        !formData.subjects.length || !formData.schoolLevels.length || !formData.teachingLocations.length ||
        !formData.cityId) {
      toast({
        title: t("error"),
        description: t("pleaseCompleteAllRequiredFields"),
        variant: "destructive",
      });
      return;
    }

    // Filter out locations without prices and validate at least one teaching location with price
    const locationsWithPrices = formData.teachingLocations.filter(location => {
      const price = formData.pricePerHour[
        location.toLowerCase().replace("'s", "").split(" ")[0] as keyof typeof formData.pricePerHour
      ];
      return price && parseFloat(price) > 0;
    });

    if (locationsWithPrices.length === 0) {
      toast({
        title: t("error"),
        description: t("pleaseAddAtLeastOneLocationWithPrice"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Starting form submission...");

    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', userId)
        .single();

      // Upload profile picture if exists
      let profilePictureUrl = null;
      if (formData.profilePicture) {
        const fileExt = formData.profilePicture.name.split('.').pop();
        const fileName = `${userId}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('profile-pictures')
          .upload(fileName, formData.profilePicture);
        
        if (uploadError) throw uploadError;
        profilePictureUrl = data.path;
      }

      console.log("Inserting/updating teacher profile...");
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
          supabase.from('teacher_locations').delete().eq('teacher_id', userId)
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
        locationsWithPrices.length > 0 && supabase
          .from('teacher_locations')
          .insert(
            locationsWithPrices.map(location => ({
              teacher_id: userId,
              location_type: location,
              price_per_hour: parseFloat(formData.pricePerHour[
                location.toLowerCase().replace("'s", "").split(" ")[0] as keyof typeof formData.pricePerHour
              ])
            }))
          )
      ]);

      toast({
        title: existingProfile ? t("profileUpdated") : t("profileCreated"),
        description: existingProfile ? t("profileUpdatedDesc") : t("profileCreatedDesc"),
      });
      
      // Navigate to profile view
      navigate("/profile");
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