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

      if (!teachersData || teachersData.length === 0) {
        console.warn('No teachers data found');
        return [];
      }

      console.log('Raw teachers data:', teachersData);

      // Verify data integrity
      const verifyTeacherData = (teacher: any) => {
        const issues = [];
        if (!teacher.teacher_subjects) issues.push('Missing subjects');
        if (!teacher.teacher_school_levels) issues.push('Missing school levels');
        if (!teacher.teacher_locations) issues.push('Missing locations');
        if (!teacher.city) issues.push('Missing city');
        
        if (issues.length > 0) {
          console.warn(`Data integrity issues for teacher ${teacher.id}:`, issues);
        }
        return issues.length === 0;
      };

      // Process and validate teachers data
      const processedTeachers = teachersData.map(teacher => {
        // Log individual teacher data for debugging
        console.log(`Processing teacher ${teacher.id}:`, {
          subjects: teacher.teacher_subjects?.length || 0,
          schoolLevels: teacher.teacher_school_levels?.length || 0,
          locations: teacher.teacher_locations?.length || 0,
          city: teacher.city
        });

        // Process profile picture URL
        const profilePictureUrl = teacher.profile_picture_url
          ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile-pictures/${teacher.profile_picture_url}`
          : null;

        const processedTeacher = {
          ...teacher,
          profile_picture_url: profilePictureUrl
        };

        verifyTeacherData(processedTeacher);
        return processedTeacher;
      });

      console.log('Final processed teachers:', processedTeachers);
      return processedTeachers;
    },
  });
};