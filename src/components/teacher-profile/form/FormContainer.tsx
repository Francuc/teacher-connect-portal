import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { type Subject, type SchoolLevel, type TeachingLocation } from "@/lib/constants";
import { FormSections } from "./FormSections";
import { type FormData } from "./types";

export const FormContainer = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    facebookProfile: "",
    showEmail: false,
    showPhone: false,
    showFacebook: false,
    bio: "",
    profilePicture: null,
    subjects: [] as Subject[],
    schoolLevels: [] as SchoolLevel[],
    teachingLocations: [] as TeachingLocation[],
    cityId: "",
    studentRegions: [] as string[],
    studentCities: [] as string[],
    pricePerHour: {
      teacherPlace: "",
      studentPlace: "",
      online: "",
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && !userId) {
        toast({
          title: t("error"),
          description: t("pleaseLoginFirst"),
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      setCurrentUserId(user?.id || userId);

      if (userId) {
        const { data: existingProfile } = await supabase
          .from('teachers')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (existingProfile) {
          setFormData(prev => ({
            ...prev,
            firstName: existingProfile.first_name,
            lastName: existingProfile.last_name,
            email: existingProfile.email,
            phone: existingProfile.phone || "",
            facebookProfile: existingProfile.facebook_profile || "",
            showEmail: existingProfile.show_email,
            showPhone: existingProfile.show_phone,
            showFacebook: existingProfile.show_facebook,
            bio: existingProfile.bio,
            cityId: existingProfile.city_id || "",
          }));

          // Fetch related data
          const { data: subjects } = await supabase
            .from('teacher_subjects')
            .select('subject')
            .eq('teacher_id', userId);
          
          const { data: schoolLevels } = await supabase
            .from('teacher_school_levels')
            .select('school_level')
            .eq('teacher_id', userId);
          
          const { data: locations } = await supabase
            .from('teacher_locations')
            .select('*')
            .eq('teacher_id', userId);

          if (subjects) setFormData(prev => ({ ...prev, subjects: subjects.map(s => s.subject) }));
          if (schoolLevels) setFormData(prev => ({ ...prev, schoolLevels: schoolLevels.map(l => l.school_level) }));
          if (locations) {
            setFormData(prev => ({
              ...prev,
              teachingLocations: locations.map(l => l.location_type as TeachingLocation),
              pricePerHour: {
                teacherPlace: locations.find(l => l.location_type === "Teacher's Place")?.price_per_hour.toString() || "",
                studentPlace: locations.find(l => l.location_type === "Student's Place")?.price_per_hour.toString() || "",
                online: locations.find(l => l.location_type === "Online")?.price_per_hour.toString() || "",
              }
            }));
          }
        }
      }
    };

    checkAuth();
  }, [navigate, t, toast, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    if (!userId) {
      toast({
        title: t("error"),
        description: t("pleaseLoginFirst"),
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
        await supabase.from('teacher_subjects').delete().eq('teacher_id', userId);
        await supabase.from('teacher_school_levels').delete().eq('teacher_id', userId);
        await supabase.from('teacher_locations').delete().eq('teacher_id', userId);
      } else {
        // Insert new profile
        const { error: profileError } = await supabase
          .from('teachers')
          .insert([profileData]);
        if (profileError) throw profileError;
      }

      console.log("Inserting subjects...");
      if (formData.subjects.length > 0) {
        const { error: subjectsError } = await supabase
          .from('teacher_subjects')
          .insert(
            formData.subjects.map(subject => ({
              teacher_id: userId,
              subject: subject
            }))
          );
        if (subjectsError) throw subjectsError;
      }

      console.log("Inserting school levels...");
      if (formData.schoolLevels.length > 0) {
        const { error: levelsError } = await supabase
          .from('teacher_school_levels')
          .insert(
            formData.schoolLevels.map(level => ({
              teacher_id: userId,
              school_level: level
            }))
          );
        if (levelsError) throw levelsError;
      }

      console.log("Inserting teaching locations...");
      if (locationsWithPrices.length > 0) {
        const { error: locationsError } = await supabase
          .from('teacher_locations')
          .insert(
            locationsWithPrices.map(location => ({
              teacher_id: userId,
              location_type: location,
              price_per_hour: parseFloat(formData.pricePerHour[
                location.toLowerCase().replace("'s", "").split(" ")[0] as keyof typeof formData.pricePerHour
              ])
            }))
          );
        if (locationsError) throw locationsError;
      }

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

  if (!currentUserId) {
    return null;
  }

  return (
    <FormSections 
      formData={formData}
      setFormData={setFormData}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      isUpdate={!!userId}
    />
  );
};