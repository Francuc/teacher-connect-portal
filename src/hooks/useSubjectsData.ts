import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useSubjectsData = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name_en');
      if (error) throw error;
      return data;
    }
  });
};