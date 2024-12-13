import { supabase } from "@/lib/supabase";

export const useTeacherCities = () => {
  const fetchTeacherCities = async (userId: string) => {
    const { data: cities, error } = await supabase
      .from('teacher_student_cities')
      .select('city_name')
      .eq('teacher_id', userId);

    if (error) throw error;
    return cities?.map(c => c.city_name) || [];
  };

  return { fetchTeacherCities };
};