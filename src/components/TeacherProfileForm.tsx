import { useState } from "react";
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

const TeacherProfileForm = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
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
    location: "",
    teacherCity: "",
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
    setIsLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Upload profile picture if exists
      let profilePictureUrl = null;
      if (formData.profilePicture) {
        const fileExt = formData.profilePicture.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('profile-pictures')
          .upload(fileName, formData.profilePicture);
        
        if (uploadError) throw uploadError;
        profilePictureUrl = data.path;
      }

      // Insert teacher profile
      const { error: profileError } = await supabase
        .from('teachers')
        .insert({
          user_id: user.id,
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
          teacher_city: formData.teacherCity,
        });

      if (profileError) throw profileError;

      // Insert subjects
      if (formData.subjects.length > 0) {
        const { error: subjectsError } = await supabase
          .from('teacher_subjects')
          .insert(
            formData.subjects.map(subject => ({
              teacher_id: user.id,
              subject: subject
            }))
          );
        if (subjectsError) throw subjectsError;
      }

      // Insert school levels
      if (formData.schoolLevels.length > 0) {
        const { error: levelsError } = await supabase
          .from('teacher_school_levels')
          .insert(
            formData.schoolLevels.map(level => ({
              teacher_id: user.id,
              school_level: level
            }))
          );
        if (levelsError) throw levelsError;
      }

      // Insert teaching locations with prices
      if (formData.teachingLocations.length > 0) {
        const { error: locationsError } = await supabase
          .from('teacher_locations')
          .insert(
            formData.teachingLocations.map(location => ({
              teacher_id: user.id,
              location_type: location,
              price_per_hour: formData.pricePerHour[
                location.toLowerCase().replace("'s", "").split(" ")[0] as keyof typeof formData.pricePerHour
              ]
            }))
          );
        if (locationsError) throw locationsError;
      }

      // Insert regions and cities
      if (formData.studentRegions.length > 0) {
        const { error: regionsError } = await supabase
          .from('teacher_regions')
          .insert(
            formData.studentRegions.map(region => ({
              teacher_id: user.id,
              region: region
            }))
          );
        if (regionsError) throw regionsError;
      }

      if (formData.studentCities.length > 0) {
        const { error: citiesError } = await supabase
          .from('teacher_cities')
          .insert(
            formData.studentCities.map(city => ({
              teacher_id: user.id,
              city: city
            }))
          );
        if (citiesError) throw citiesError;
      }

      toast({
        title: t("profileSaved"),
        description: t("profileSavedDesc"),
      });
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