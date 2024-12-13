import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useTeachersData = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      console.log("Fetching teachers data...");

      const { data: teachers, error } = await supabase
        .from("teachers")
        .select(`
          *,
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
          teacher_student_cities(
            id,
            city_name
          ),
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
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching teachers:", error);
        throw error;
      }

      if (!teachers) {
        console.log("No teachers found");
        return [];
      }

      console.log(`Found ${teachers.length} teachers`);

      // Filter out teachers with incomplete data
      const validTeachers = teachers.filter((teacher) => {
        const isValid =
          teacher &&
          teacher.teacher_subjects?.length > 0 &&
          teacher.teacher_school_levels?.length > 0 &&
          teacher.teacher_locations?.length > 0;

        if (!isValid) {
          console.warn(
            `Teacher ${teacher.id} filtered out due to incomplete data:`,
            {
              hasSubjects: teacher.teacher_subjects?.length > 0,
              hasSchoolLevels: teacher.teacher_school_levels?.length > 0,
              hasLocations: teacher.teacher_locations?.length > 0,
            }
          );
        }

        return isValid;
      });

      console.log(`Returning ${validTeachers.length} valid teachers`);
      return validTeachers;
    },
    gcTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};