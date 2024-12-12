import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { TeachingLocation } from "@/lib/constants";
import { PersonalSection } from "./profile-sections/PersonalSection";
import { LocationsSection } from "./profile-sections/LocationsSection";
import { SubjectsSection } from "./profile-sections/SubjectsSection";
import { SchoolLevelsSection } from "./profile-sections/SchoolLevelsSection";
import { BiographySection } from "./profile-sections/BiographySection";

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
  const [profile, setProfile] = useState<TeacherProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
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
    };

    fetchProfile();
  }, [userId]);

  if (!profile) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <PersonalSection profile={profile} />
      <LocationsSection locations={profile.locations} city={profile.city} />
      <SubjectsSection subjects={profile.subjects} />
      <SchoolLevelsSection schoolLevels={profile.school_levels} />
      <BiographySection bio={profile.bio} />
    </div>
  );
};