import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Teacher {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  facebook_profile?: string;
  show_email: boolean;
  show_phone: boolean;
  show_facebook: boolean;
  bio: string;
  profile_picture_url?: string;
  city_id?: string;
  created_at: string;
  updated_at: string;
  teacher_subjects: Array<{
    id: string;
    subject: {
      id: string;
      name_en: string;
      name_fr: string;
      name_lb: string;
    };
  }>;
  teacher_school_levels: Array<{
    id: string;
    school_level: string;
  }>;
  teacher_locations: Array<{
    id: string;
    location_type: string;
    price_per_hour: number;
  }>;
  teacher_student_cities: Array<{
    id: string;
    city_name: string;
  }>;
  city?: {
    id: string;
    name_en: string;
    name_fr: string;
    name_lb: string;
    region?: {
      id: string;
      name_en: string;
      name_fr: string;
      name_lb: string;
    };
  };
}

export const useTeachersData = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async (): Promise<Teacher[]> => {
      console.log("Fetching teachers data...");

      const { data: teachers, error } = await supabase
        .from("teachers")
        .select(`
          *,
          teacher_subjects(
            id,
            subject(
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
          ),
          city(
            id,
            name_en,
            name_fr,
            name_lb,
            region(
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