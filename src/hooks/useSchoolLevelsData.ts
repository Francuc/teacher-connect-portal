import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useSchoolLevelsData = () => {
  return useQuery({
    queryKey: ['schoolLevels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_levels')
        .select('*')
        .order('name_en');
      if (error) throw error;
      return data;
    }
  });
};