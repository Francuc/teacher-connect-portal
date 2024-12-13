import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useTeachersData = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      console.log('Fetching teachers data with all relationships...');
      
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
            id,
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

      console.log('Fetched teachers data:', teachersData);

      // Process profile picture URLs
      const processedTeachers = teachersData.map(teacher => {
        if (!teacher.profile_picture_url) return teacher;

        return {
          ...teacher,
          profile_picture_url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile-pictures/${teacher.profile_picture_url}`
        };
      });

      return processedTeachers;
    },
  });
};