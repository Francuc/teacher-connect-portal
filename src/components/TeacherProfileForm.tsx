import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { type Subject, type SchoolLevel, type TeachingLocation } from "@/lib/constants";
import { PersonalInfoSection } from "./teacher-profile/PersonalInfoSection";
import { SubjectsSection } from "./teacher-profile/SubjectsSection";
import { LocationSection } from "./teacher-profile/LocationSection";
import { BiographySection } from "./teacher-profile/BiographySection";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TeacherProfileForm = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: t("error"),
          description: t("pleaseLoginFirst"),
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      setUserId(user.id);
    };

    checkAuth();
  }, [navigate, t, toast]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    facebookProfile: "",
    showEmail: false,
    showPhone: false,
    showFacebook: false,
    bio: "",
    profilePicture: null as File | null,
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

    setIsLoading(true);
    console.log("Starting form submission...");

    try {
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

      console.log("Inserting teacher profile...");
      // Insert teacher profile
      const { error: profileError } = await supabase
        .from('teachers')
        .insert({
          user_id: userId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          facebook_profile: formData.facebookProfile,
          show_email: formData.showEmail,
          show_phone: formData.showPhone,
          show_facebook: formData.showFacebook,
          bio: formData.bio,
          profile_picture_url: profilePictureUrl,
          city_id: formData.cityId || null,
        });

      if (profileError) throw profileError;

      console.log("Inserting subjects...");
      // Insert subjects
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
      // Insert school levels
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
      // Insert teaching locations with prices
      if (formData.teachingLocations.length > 0) {
        const { error: locationsError } = await supabase
          .from('teacher_locations')
          .insert(
            formData.teachingLocations.map(location => ({
              teacher_id: userId,
              location_type: location,
              price_per_hour: formData.pricePerHour[
                location.toLowerCase().replace("'s", "").split(" ")[0] as keyof typeof formData.pricePerHour
              ]
            }))
          );
        if (locationsError) throw locationsError;
      }

      toast({
        title: t("profileSaved"),
        description: t("profileSavedDesc"),
      });
      
      // Navigate to profile view or dashboard
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

  if (!userId) {
    return null; // Don't render the form until we confirm authentication
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 space-y-6">
      <PersonalInfoSection formData={formData} setFormData={setFormData} />
      <SubjectsSection formData={formData} setFormData={setFormData} />
      <LocationSection formData={formData} setFormData={setFormData} />
      <BiographySection formData={formData} setFormData={setFormData} />

      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("saveProfile")}
        </Button>
      </div>
    </form>
  );
};

export default TeacherProfileForm;