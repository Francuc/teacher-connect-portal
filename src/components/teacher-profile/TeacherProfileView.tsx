import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PersonalSection } from "./profile-sections/PersonalSection";
import { BiographySection } from "./profile-sections/BiographySection";
import { SubjectsSection } from "./SubjectsSection";
import { SchoolLevelsSection } from "./profile-sections/SchoolLevelsSection";
import { LocationsSection } from "./profile-sections/LocationsSection";

interface TeacherProfileViewProps {
  userId: string;
}

export const TeacherProfileView = ({ userId }: TeacherProfileViewProps) => {
  const { data: teacherData, isLoading } = useQuery({
    queryKey: ['teacher', userId],
    queryFn: async () => {
      const { data: profile, error: profileError } = await supabase
        .from('teachers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

      const [
        { data: subjects },
        { data: schoolLevels },
        { data: locations },
        { data: studentRegions },
        { data: studentCities },
        { data: city }
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
          .eq('teacher_id', userId),
        profile?.city_id ? supabase
          .from('cities')
          .select(`
            *,
            region:regions (
              id,
              name_en,
              name_fr,
              name_lb
            )
          `)
          .eq('id', profile.city_id)
          .single() : { data: null }
      ]);

      return {
        profile,
        subjects: subjects?.map(s => ({
          subject: s.subject[0] // Fix: Access first element of subject array
        })) || [],
        schoolLevels: schoolLevels?.map(l => l.school_level) || [],
        locations: locations || [],
        studentRegions: studentRegions?.map(r => r.region_name) || [],
        studentCities: studentCities?.map(c => c.city_name) || [],
        city
      };
    },
  });

  if (isLoading || !teacherData) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <PersonalSection profile={teacherData.profile} />
      <BiographySection bio={teacherData.profile.bio} />
      <SubjectsSection subjects={teacherData.subjects} />
      <SchoolLevelsSection schoolLevels={teacherData.schoolLevels} />
      <LocationsSection 
        locations={teacherData.locations}
        city={teacherData.city}
        studentRegions={teacherData.studentRegions}
        studentCities={teacherData.studentCities}
      />
    </div>
  );
};