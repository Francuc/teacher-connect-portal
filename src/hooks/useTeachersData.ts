import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useTeachersData = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      console.log('Fetching teachers data...');
      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers')
        .select(`
          *,
          city:cities!inner(
            id,
            name_en,
            name_fr,
            name_lb,
            region:regions!inner(
              id,
              name_en,
              name_fr,
              name_lb
            )
          ),
          teacher_subjects!inner(
            id,
            subject:subjects!inner(
              id,
              name_en,
              name_fr,
              name_lb
            )
          ),
          teacher_school_levels!inner(
            id,
            school_level
          ),
          teacher_locations!inner(
            id,
            location_type,
            price_per_hour
          ),
          teacher_student_cities!inner(
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

        const profilePictureUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile-pictures/${teacher.profile_picture_url}`;
        console.log(`Generated profile picture URL for teacher ${teacher.id}:`, profilePictureUrl);

        return {
          ...teacher,
          profile_picture_url: profilePictureUrl
        };
      });

      console.log('Processed teachers data:', processedTeachers);
      return processedTeachers;
    },
  });
};