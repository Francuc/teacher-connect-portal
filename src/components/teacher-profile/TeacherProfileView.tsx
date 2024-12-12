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
import { Pencil, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { TeacherSubject } from "./form/types";

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
  subjects: TeacherSubject[];
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
  student_regions: string[];
  student_cities: string[];
};

export const TeacherProfileView = ({ userId }: { userId: string }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

        const { data: teacherSubjects } = await supabase
          .from('teacher_subjects')
          .select(`
            subject_id,
            subject:subjects (
              id,
              name_en,
              name_fr,
              name_lb
            )
          `)
          .eq('teacher_id', userId);

        const { data: schoolLevels } = await supabase
          .from('teacher_school_levels')
          .select('school_level')
          .eq('teacher_id', userId);

        const { data: studentRegions } = await supabase
          .from('teacher_student_regions')
          .select('region_name')
          .eq('teacher_id', userId);

        const { data: studentCities } = await supabase
          .from('teacher_student_cities')
          .select('city_name')
          .eq('teacher_id', userId);

        setProfile({
          ...teacherData,
          locations: locations || [],
          subjects: teacherSubjects || [],
          school_levels: schoolLevels?.map(l => l.school_level) || [],
          student_regions: studentRegions?.map(r => r.region_name) || [],
          student_cities: studentCities?.map(c => c.city_name) || []
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

  const getLocalizedSubjectName = (subject: TeacherSubject) => {
    switch(language) {
      case 'fr':
        return subject.subject.name_fr;
      case 'lb':
        return subject.subject.name_lb;
      default:
        return subject.subject.name_en;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex flex-col items-center mb-8">
        <Avatar className="w-32 h-32 mb-4">
          {profile.profile_picture_url ? (
            <AvatarImage src={profile.profile_picture_url} alt={`${profile.first_name} ${profile.last_name}`} />
          ) : (
            <AvatarFallback>
              <User className="w-16 h-16" />
            </AvatarFallback>
          )}
        </Avatar>
        {isAuthenticated && (
          <Button
            onClick={handleEditClick}
            className="flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            {t("editProfile")}
          </Button>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <PersonalSection profile={profile} />
          <BiographySection bio={profile.bio} />
        </div>
        <div className="space-y-6">
          <LocationsSection 
            locations={profile.locations} 
            city={profile.city}
            studentRegions={profile.student_regions}
            studentCities={profile.student_cities}
          />
          <SubjectsSection subjects={profile.subjects.map(getLocalizedSubjectName)} />
          <SchoolLevelsSection schoolLevels={profile.school_levels} />
        </div>
      </div>
    </div>
  );
};
