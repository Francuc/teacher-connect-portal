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
  
  console.log('Fetching teacher profile for userId:', userId);

  const { data: teacherData, isLoading, error } = useQuery({
    queryKey: ['teacher', userId],
    queryFn: async () => {
      console.log('Starting teacher data fetch...');

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
        console.error('Error fetching teacher profile:', profileError);
        throw profileError;
      }

      console.log('Fetched teacher profile:', profile);

      if (!profile) {
        console.error('No teacher profile found for userId:', userId);
        throw new Error('Teacher profile not found');
      }

      if (profile.profile_picture_url) {
        const { data } = supabase
          .storage
          .from('profile-pictures')
          .getPublicUrl(profile.profile_picture_url);
        profile.profile_picture_url = data.publicUrl;
      }

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

      console.log('Fetched related data:', {
        subjects: subjectsData,
        schoolLevels,
        locations,
        studentRegions,
        studentCities
      });

      const subjects = subjectsData?.map(item => ({
        subject_id: item.subject_id,
        subject: item.subject
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

  console.log('Query state:', { isLoading, error, teacherData });

  if (error) {
    console.error('Error in TeacherProfileView:', error);
    return <div className="flex justify-center items-center min-h-screen text-red-500">
      Error loading teacher profile. Please try again later.
    </div>;
  }

  if (isLoading || !teacherData) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  const handleEditClick = () => {
    navigate(`/profile/edit/${userId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-end mb-6">
        <Button 
          onClick={handleEditClick}
          className="bg-primary hover:bg-primary/90 w-10 h-10"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid gap-6">
        <PersonalSection profile={teacherData.profile} />
        <div className="grid grid-cols-1 gap-6">
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
      </div>
    </div>
  );
};