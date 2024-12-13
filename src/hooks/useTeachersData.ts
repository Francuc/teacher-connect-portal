import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useTeachersData = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      console.info("Fetching teachers data with relations...");
      
      const { data: teachers, error } = await supabase
        .from('teachers')
        .select(`
          *,
          city:cities(
            id,
            name_en,
            name_fr,
            name_lb,
            region:regions(
              id,
              name_en,
              name_fr,
              name_lb
            )
          ),
          teacher_subjects(
            subject:subjects(
              id,
              name_en,
              name_fr,
              name_lb
            )
          ),
          teacher_school_levels(
            school_level,
            created_at
          ),
          teacher_locations(
            location_type,
            price_per_hour
          ),
          teacher_student_cities(
            city_name
          )
        `);

      if (error) {
        console.error("Error fetching teachers:", error);
        throw error;
      }

      console.info("Teachers data fetched:", teachers?.length);
      return teachers;
    },
    gcTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};