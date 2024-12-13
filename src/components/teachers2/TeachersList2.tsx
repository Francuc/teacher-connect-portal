import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TeachersGrid2 } from "./TeachersGrid2";
import { useLanguage } from "@/contexts/LanguageContext";

export const TeachersList2 = () => {
  const { language } = useLanguage();

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["teachers2"],
    queryFn: async () => {
      const { data, error } = await supabase
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