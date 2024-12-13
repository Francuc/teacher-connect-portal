import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useTeachersData = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      console.log('Fetching teachers data with all relations...');
      const { data: teachersData, error: teachersError } = await supabase
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
            subject_id,
            subject:subjects(
              id,
              name_en,
              name_fr,
              name_lb
            )
          ),
          teacher_school_levels(
            id,
            school_level
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
        `);

      if (teachersError) {
        console.error('Error fetching teachers:', teachersError);
        throw teachersError;
      }

      console.log('Raw teachers data:', teachersData);

      // Process each teacher's data to include the profile picture URL
      const processedTeachers = teachersData.map(teacher => {
        if (!teacher.profile_picture_url) {
          console.log(`No profile picture for teacher ${teacher.id}`);
          return teacher;
        }

        return {
          ...teacher,
          profile_picture_url: teacher.profile_picture_url
        };
      });

      console.log('Processed teachers data:', processedTeachers);
      return processedTeachers;
    },
    staleTime: Infinity, // Prevent automatic refetching
    gcTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on mount
    retry: 2, // Retry failed requests twice
  });
};