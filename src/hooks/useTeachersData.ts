import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useTeachersData = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      console.log('Fetching teachers data...');
      const { data: teachers, error: teachersError } = await supabase
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
            id,
            subject:subjects(
              id,
              name_en,
              name_fr,
              name_lb
            )
          ),
          teacher_school_levels(
            school_level,
            id
          ),
          teacher_locations(
            id,
            location_type,
            price_per_hour
          ),
          teacher_student_cities(
            id,
            city_name
          )
        `)
        .order('created_at', { ascending: false });

      if (teachersError) {
        console.error('Error fetching teachers:', teachersError);
        throw teachersError;
      }

      console.log('Teachers data received:', teachers?.length);
      return teachers || [];
    },
    staleTime: 30000, // Data considered fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Cache kept for 5 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: true, // Always fetch fresh data on mount
  });
};