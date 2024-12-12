import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { type Subject, type SchoolLevel, type TeachingLocation } from "@/lib/constants";
import { PersonalInfoSection } from "./teacher-profile/PersonalInfoSection";
import { SubjectsSection } from "./teacher-profile/SubjectsSection";
import { LocationSection } from "./teacher-profile/LocationSection";
import { BiographySection } from "./teacher-profile/BiographySection";
import { TeacherProfileView } from "./teacher-profile/TeacherProfileView";
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
        navigate("/");
        return;
      }
      setUserId(user.id);

      // Check if teacher profile exists
      const { data: existingProfile } = await supabase
        .from('teachers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        // Pre-fill form with existing data
        setFormData({
          firstName: existingProfile.first_name,
          lastName: existingProfile.last_name,
          email: existingProfile.email,
          phone: existingProfile.phone || "",
          facebookProfile: existingProfile.facebook_profile || "",
          showEmail: existingProfile.show_email,
          showPhone: existingProfile.show_phone,
          showFacebook: existingProfile.show_facebook,
          bio: existingProfile.bio,
          profilePicture: null,
          subjects: [],
          schoolLevels: [],
          teachingLocations: [],
          cityId: existingProfile.city_id || "",
          studentRegions: [],
          studentCities: [],
          pricePerHour: {
            teacherPlace: "",
            studentPlace: "",
            online: "",
          },
        });

        // Fetch related data
        const { data: subjects } = await supabase
          .from('teacher_subjects')
          .select('subject')
          .eq('teacher_id', user.id);
        
        const { data: schoolLevels } = await supabase
          .from('teacher_school_levels')
          .select('school_level')
          .eq('teacher_id', user.id);
        
        const { data: locations } = await supabase
          .from('teacher_locations')
          .select('*')
          .eq('teacher_id', user.id);

        if (subjects) setFormData(prev => ({ ...prev, subjects: subjects.map(s => s.subject) }));
        if (schoolLevels) setFormData(prev => ({ ...prev, schoolLevels: schoolLevels.map(l => l.school_level) }));
        if (locations) {
          setFormData(prev => ({
            ...prev,
            teachingLocations: locations.map(l => l.location_type as TeachingLocation),
            pricePerHour: {
              teacherPlace: locations.find(l => l.location_type === "Teacher's Place")?.price_per_hour || "",
              studentPlace: locations.find(l => l.location_type === "Student's Place")?.price_per_hour || "",
              online: locations.find(l => l.location_type === "Online")?.price_per_hour || "",
            }
          }));
        }
      }
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
        // First, delete existing locations
        if (existingProfile) {
          await supabase
            .from('teacher_locations')
            .delete()
            .eq('teacher_id', userId);
        }

        // Then insert new locations
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

  if (!userId) {
    return null;
  }

  // If we're viewing the profile, show the TeacherProfileView component
  if (window.location.pathname === "/profile") {
    return <TeacherProfileView userId={userId} />;
  }

  // Otherwise show the form
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
