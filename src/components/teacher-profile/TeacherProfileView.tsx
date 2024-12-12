import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { PersonalSection } from "./profile-sections/PersonalSection";
import { BiographySection } from "./profile-sections/BiographySection";
import { SubjectsSection } from "./profile-sections/SubjectsSection";
import { SchoolLevelsSection } from "./profile-sections/SchoolLevelsSection";
import { LocationsSection } from "./profile-sections/LocationsSection";

interface TeacherProfileViewProps {
  userId: string;
}

export const TeacherProfileView = ({ userId }: TeacherProfileViewProps) => {
  const { language } = useLanguage();
  const [localizedSubjects, setLocalizedSubjects] = useState<string[]>([]);

  const { data: teacherData } = useQuery({
    queryKey: ['teacher', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          *,
          teacher_subjects (
            subject:subjects (
              id,
              name_en,
              name_fr,
              name_lb
            )
          ),
          teacher_school_levels (
            school_level
          ),
          teacher_locations (
            location_type,
            price_per_hour
          ),
          teacher_student_regions (
            region_name
          ),
          teacher_student_cities (
            city_name
          ),
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

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (teacherData?.teacher_subjects) {
      const subjects = teacherData.teacher_subjects.map(subjectData => {
        const subject = subjectData.subject;
        switch(language) {
          case 'fr':
            return subject.name_fr;
          case 'lb':
            return subject.name_lb;
          default:
            return subject.name_en;
        }
      });
      setLocalizedSubjects(subjects);
    }
  }, [teacherData?.teacher_subjects, language]);

  if (!teacherData) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <PersonalSection profile={teacherData} />
      <BiographySection bio={teacherData.bio} />
      <SubjectsSection subjects={localizedSubjects} />
      <SchoolLevelsSection 
        schoolLevels={teacherData.teacher_school_levels.map(level => level.school_level)} 
      />
      <LocationsSection
        locations={teacherData.teacher_locations}
        city={teacherData.city}
        studentRegions={teacherData.teacher_student_regions.map(r => r.region_name)}
        studentCities={teacherData.teacher_student_cities.map(c => c.city_name)}
      />
    </div>
  );
};