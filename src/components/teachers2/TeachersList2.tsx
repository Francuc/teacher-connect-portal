import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TeachersGrid2 } from "./TeachersGrid2";
import { useLanguage } from "@/contexts/LanguageContext";

interface TeachersList2Props {
  cityFilter?: string;
  subjectFilter?: string;
}

export const TeachersList2 = ({ cityFilter, subjectFilter }: TeachersList2Props) => {
  const { language } = useLanguage();

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["teachers2", cityFilter, subjectFilter],
    queryFn: async () => {
      let query = supabase
        .from('teachers')
        .select(`
          *,
          city:cities!left (*,
            region:regions!left (*)
          ),
          teacher_subjects!left (
            subject:subjects!left (*)
          ),
          teacher_school_levels!left (
            school_level
          ),
          teacher_locations!left (
            location_type,
            price_per_hour
          ),
          teacher_student_cities!left (
            city_name
          )
        `)
        .eq('subscription_status', 'active')
        .order('created_at', { ascending: false });

      if (cityFilter) {
        query = query.eq('city_id', cityFilter);
      }

      if (subjectFilter && subjectFilter !== 'all') {
        query = query.contains('teacher_subjects', [{ subject_id: subjectFilter }]);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching teachers:", error);
        throw error;
      }

      return data || [];
    }
  });

  return (
    <div className="container mx-auto px-4">
      <TeachersGrid2 
        teachers={teachers}
        isLoading={isLoading}
        language={language}
      />
    </div>
  );
};