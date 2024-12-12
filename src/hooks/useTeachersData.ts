import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useTeachersData = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      console.log('Fetching teachers data...');
      const { data, error } = await supabase
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
            school_level
          ),
          teacher_locations(
            location_type,
            price_per_hour
          ),
          teacher_student_cities(
            city_name
          ),
          teacher_student_regions(
            region_name
          )
        `);
      
      if (error) {
        console.error('Error fetching teachers:', error);
        throw error;
      }

      // Use the public URL format for profile pictures
      const teachersWithUrls = data.map(teacher => {
        if (teacher.profile_picture_url) {
          return {
            ...teacher,
            profile_picture_url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile-pictures/${teacher.profile_picture_url}`
          };
        }
        return teacher;
      });
      
      console.log('Teachers data with subjects:', teachersWithUrls);
      return teachersWithUrls || [];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
};