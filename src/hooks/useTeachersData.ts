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
          )
        `);

      if (teachersError) {
        console.error('Error fetching teachers:', teachersError);
        throw teachersError;
      }

      // Process each teacher's data
      const processedTeachers = await Promise.all(teachersData.map(async (teacher) => {
        // Fetch subjects with a direct join to the subjects table
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('teacher_subjects')
          .select(`
            subject:subjects(
              id,
              name_en,
              name_fr,
              name_lb
            )
          `)
          .eq('teacher_id', teacher.user_id);

        if (subjectsError) {
          console.error('Error fetching subjects for teacher:', teacher.user_id, subjectsError);
        }

        // Fetch school levels
        const { data: levelsData, error: levelsError } = await supabase
          .from('teacher_school_levels')
          .select('*')
          .eq('teacher_id', teacher.user_id);

        if (levelsError) {
          console.error('Error fetching levels for teacher:', teacher.user_id, levelsError);
        }

        // Fetch locations
        const { data: locationsData, error: locationsError } = await supabase
          .from('teacher_locations')
          .select('*')
          .eq('teacher_id', teacher.user_id);

        if (locationsError) {
          console.error('Error fetching locations for teacher:', teacher.user_id, locationsError);
        }

        // Fetch student cities
        const { data: studentCitiesData, error: citiesError } = await supabase
          .from('teacher_student_cities')
          .select('*')
          .eq('teacher_id', teacher.user_id);

        if (citiesError) {
          console.error('Error fetching student cities for teacher:', teacher.user_id, citiesError);
        }

        // Process profile picture URL
        const profilePictureUrl = teacher.profile_picture_url
          ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile-pictures/${teacher.profile_picture_url}`
          : null;

        const processedTeacher = {
          ...teacher,
          profile_picture_url: profilePictureUrl,
          teacher_subjects: subjectsData || [],
          teacher_school_levels: levelsData || [],
          teacher_locations: locationsData || [],
          teacher_student_cities: studentCitiesData || []
        };

        console.log('Processed teacher data:', processedTeacher);
        return processedTeacher;
      }));

      console.log('All processed teachers:', processedTeachers);
      return processedTeachers;
    },
  });
};