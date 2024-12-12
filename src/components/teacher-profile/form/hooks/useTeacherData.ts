import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TeacherSubject } from "../types/teacherTypes";

export const useTeacherData = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['teacher', userId],
    queryFn: async () => {
      if (!userId) return null;

      const [
        { data: existingProfile },
        { data: locations },
        { data: teacherSubjects },
        { data: schoolLevels },
        { data: studentRegions },
        { data: studentCities }
      ] = await Promise.all([
        supabase
          .from('teachers')
          .select('*')
          .eq('user_id', userId)
          .single(),
        supabase
          .from('teacher_locations')
          .select('*')
          .eq('teacher_id', userId),
        supabase
          .from('teacher_subjects')
          .select(`
            subject_id,
            subject:subjects (
              id,
              name_en,
              name_fr,
              name_lb
            )
          `)
          .eq('teacher_id', userId),
        supabase
          .from('teacher_school_levels')
          .select('school_level')
          .eq('teacher_id', userId),
        supabase
          .from('teacher_student_regions')
          .select('region_name')
          .eq('teacher_id', userId),
        supabase
          .from('teacher_student_cities')
          .select('city_name')
          .eq('teacher_id', userId)
      ]);

      return {
        profile: existingProfile,
        locations: locations || [],
        subjects: (teacherSubjects || []) as TeacherSubject[],
        schoolLevels: schoolLevels?.map(l => l.school_level) || [],
        studentRegions: studentRegions?.map(r => r.region_name) || [],
        studentCities: studentCities?.map(c => c.city_name) || []
      };
    },
    enabled: !!userId
  });
};