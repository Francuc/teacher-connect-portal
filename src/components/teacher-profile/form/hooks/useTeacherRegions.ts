import { supabase } from "@/lib/supabase";

export const useTeacherRegions = () => {
  const fetchTeacherRegions = async (userId: string) => {
    const { data: regions, error } = await supabase
      .from('teacher_student_regions')
      .select('region_name')
      .eq('teacher_id', userId);

    if (error) throw error;
    return regions?.map(r => r.region_name) || [];
  };

  return { fetchTeacherRegions };
};