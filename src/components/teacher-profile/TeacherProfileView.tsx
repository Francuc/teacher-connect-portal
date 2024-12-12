import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { TeachingLocation } from "@/lib/constants";
import { PersonalSection } from "./profile-sections/PersonalSection";
import { LocationsSection } from "./profile-sections/LocationsSection";
import { SubjectsSection } from "./profile-sections/SubjectsSection";
import { SchoolLevelsSection } from "./profile-sections/SchoolLevelsSection";
import { BiographySection } from "./profile-sections/BiographySection";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type TeacherProfile = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  facebook_profile: string | null;
  show_email: boolean;
  show_phone: boolean;
  show_facebook: boolean;
  bio: string;
  profile_picture_url: string | null;
  locations: {
    location_type: TeachingLocation;
    price_per_hour: number;
  }[];
  subjects: string[];
  school_levels: string[];
  city: {
    name_en: string;
    name_fr: string;
    name_lb: string;
    region: {
      name_en: string;
      name_fr: string;
      name_lb: string;
    };
  } | null;
};

export const TeacherProfileView = ({ userId }: { userId: string }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const checkCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsCurrentUser(user?.id === userId);
    };

    checkCurrentUser();
  }, [userId]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      try {
        const { data: teacherData, error: teacherError } = await supabase
          .from('teachers')
          .select(`
            *,
            city:cities(
              name_en,
              name_fr,
              name_lb,
              region:regions(
                name_en,
                name_fr,
                name_lb
              )
            )
          `)
          .eq('user_id', userId)
          .single();

        if (teacherError) {
          console.error('Error fetching teacher:', teacherError);
          toast({
            title: t("error"),
            description: t("errorLoadingProfile"),
            variant: "destructive",
          });
          return;
        }

        const { data: locations } = await supabase
          .from('teacher_locations')
          .select('*')
          .eq('teacher_id', userId);

        const { data: subjects } = await supabase
          .from('teacher_subjects')
          .select('subject')
          .eq('teacher_id', userId);

        const { data: schoolLevels } = await supabase
          .from('teacher_school_levels')
          .select('school_level')
          .eq('teacher_id', userId);

        setProfile({
          ...teacherData,
          locations: locations || [],
          subjects: subjects?.map(s => s.subject) || [],
          school_levels: schoolLevels?.map(l => l.school_level) || []
        });
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: t("error"),
          description: t("errorLoadingProfile"),
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, [userId, t, toast]);

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p>{t("loading")}</p>
      </div>
    );
  }

  const handleEditClick = () => {
    navigate(`/profile/edit/${userId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {isCurrentUser && (
        <div className="flex justify-end">
          <Button
            onClick={handleEditClick}
            className="flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            {t("editProfile")}
          </Button>
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <PersonalSection profile={profile} />
          <BiographySection bio={profile.bio} />
        </div>
        <div className="space-y-6">
          <LocationsSection locations={profile.locations} city={profile.city} />
          <SubjectsSection subjects={profile.subjects} />
          <SchoolLevelsSection schoolLevels={profile.school_levels} />
        </div>
      </div>
    </div>
  );
};