import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TeachersGrid2 } from "./TeachersGrid2";
import { useLanguage } from "@/contexts/LanguageContext";

export const TeachersList2 = () => {
  const { language } = useLanguage();

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["teachers2"],
    queryFn: async () => {
      console.log("Fetching all teachers data without limits...");
      
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          *,
          city:cities (
            *,
            region:regions (*)
          ),
          teacher_subjects!left (
            subject:subjects!inner (*)
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
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching teachers:", error);
        throw error;
      }

      console.log("Teachers data fetched:", data?.length);
      console.log("Teachers data details:", data);
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