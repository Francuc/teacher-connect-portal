import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useTeachersData = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      console.log('Starting teacher data fetch...');
      
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

      if (!teachersData) {
        console.warn('No teachers data found');
        return [];
      }

      // Data verification and logging
      const verifyTeacherData = (teacher: any) => {
        console.log('Verifying teacher data:', {
          id: teacher.id,
          name: `${teacher.first_name} ${teacher.last_name}`,
          subjects: teacher.teacher_subjects?.length || 0,
          schoolLevels: teacher.teacher_school_levels?.length || 0,
          locations: teacher.teacher_locations?.length || 0,
          studentCities: teacher.teacher_student_cities?.length || 0
        });

        const issues = [];
        if (!teacher.teacher_subjects?.length) issues.push('Missing subjects');
        if (!teacher.teacher_school_levels?.length) issues.push('Missing school levels');
        if (!teacher.teacher_locations?.length) issues.push('Missing locations');
        if (!teacher.teacher_student_cities?.length) issues.push('Missing student cities');
        
        if (issues.length > 0) {
          console.warn(`Data integrity issues for teacher ${teacher.id}:`, issues);
        }
        return issues.length === 0;
      };

      // Process and validate teachers data
      const processedTeachers = teachersData
        .filter(teacher => {
          const isValid = verifyTeacherData(teacher);
          if (!isValid) {
            console.warn(`Filtering out teacher ${teacher.id} due to missing data`);
          }
          return isValid;
        })
        .map(teacher => {
          // Process profile picture URL
          const profilePictureUrl = teacher.profile_picture_url
            ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile-pictures/${teacher.profile_picture_url}`
            : null;

          return {
            ...teacher,
            profile_picture_url: profilePictureUrl
          };
        });

      console.log('Final processed teachers:', processedTeachers);
      return processedTeachers;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes (renamed from cacheTime)
  });
};