import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TeachersGrid2 } from "./TeachersGrid2";
import { useLanguage } from "@/contexts/LanguageContext";

export const TeachersList2 = () => {
  const { language } = useLanguage();

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["teachers2"],
    queryFn: async () => {
      console.log("Fetching teachers data with all relations...");
      
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          *,
          city:cities!inner (
            *,
            region:regions!inner (*)
          ),
          teacher_subjects!inner (
            subject:subjects!inner (*)
          ),
          teacher_school_levels!inner (
            school_level
          ),
          teacher_locations!inner (
            location_type,
            price_per_hour
          ),
          teacher_student_cities!inner (
            city_name
          )
        `);

      if (error) {
        console.error("Error fetching teachers:", error);
        throw error;
      }

      console.log("Teachers data fetched:", data?.length);
      return data;
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