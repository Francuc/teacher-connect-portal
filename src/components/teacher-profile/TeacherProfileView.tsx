import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PersonalSection } from "./profile-sections/PersonalSection";
import { BiographySection } from "./BiographySection";
import { SubjectsSection } from "./SubjectsSection";
import { SchoolLevelsSection } from "./SchoolLevelsSection";
import { LocationsSection } from "./profile-sections/LocationsSection";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface TeacherProfileViewProps {
  userId: string;
}

export const TeacherProfileView = ({ userId }: TeacherProfileViewProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const { data: teacherData, isLoading } = useQuery({
    queryKey: ['teacher', userId],
    queryFn: async () => {
      console.log('Fetching teacher data for userId:', userId);
      const { data: profile, error: profileError } = await supabase
        .from('teachers')
        .select(`
          *,
          city:cities (
            id,
            name_en,
            name_fr,
            name_lb,
            region:regions (
              id,
              name_en,
              name_fr,
              name_lb
            )
          )
        `)
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      // Get the public URL for the profile picture if it exists
      if (profile.profile_picture_url) {
        const { data } = supabase
          .storage
          .from('profile-pictures')
          .getPublicUrl(profile.profile_picture_url);
        profile.profile_picture_url = data.publicUrl;
        console.log('Profile picture URL:', profile.profile_picture_url);
      }

      console.log('Profile data:', profile);

      const [
        { data: subjectsData },
        { data: schoolLevels },
        { data: locations },
        { data: studentRegions },
        { data: studentCities }
      ] = await Promise.all([
        supabase
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
          .eq('teacher_id', userId),
        supabase
          .from('teacher_school_levels')
          .select('school_level')
          .eq('teacher_id', userId),
        supabase
          .from('teacher_locations')
          .select('*')
          .eq('teacher_id', userId),
        supabase
          .from('teacher_student_regions')
          .select('region_name')
          .eq('teacher_id', userId),
        supabase
          .from('teacher_student_cities')
          .select('city_name')
          .eq('teacher_id', userId)
      ]);

      // Transform subjects data to match expected format
      const subjects = subjectsData?.map(item => ({
        subject_id: item.subject_id,
        subject: item.subject[0]
      })) || [];

      return {
        profile,
        subjects,
        schoolLevels: schoolLevels?.map(l => l.school_level) || [],
        locations: locations || [],
        studentRegions: studentRegions?.map(r => r.region_name) || [],
        studentCities: studentCities?.map(c => c.city_name) || [],
      };
    },
  });

  if (isLoading || !teacherData) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  const handleEditClick = () => {
    navigate(`/profile/edit/${userId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-end">
        <Button 
          onClick={handleEditClick}
          className="bg-primary hover:bg-primary/90"
        >
          <Pencil className="w-4 h-4 mr-2" />
          {t("editProfile")}
        </Button>
      </div>
      <PersonalSection profile={teacherData.profile} />
      <BiographySection bio={teacherData.profile.bio} />
      <SubjectsSection subjects={teacherData.subjects} />
      <SchoolLevelsSection schoolLevels={teacherData.schoolLevels} />
      <LocationsSection 
        locations={teacherData.locations}
        city={teacherData.profile.city}
        studentRegions={teacherData.studentRegions}
        studentCities={teacherData.studentCities}
      />
    </div>
  );
};