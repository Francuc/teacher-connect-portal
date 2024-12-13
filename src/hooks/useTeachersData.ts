import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useTeachersData = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      console.log("Fetching teachers data with relations...");
      
      const { data: teachers, error } = await supabase
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

      console.log("Teachers data fetched:", teachers?.length);
      return teachers;
    },
    gcTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};