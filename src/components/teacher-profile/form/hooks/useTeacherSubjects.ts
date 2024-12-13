import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useTeacherSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name_en');
      
      if (error) {
        console.error('Error fetching subjects:', error);
        throw error;
      }

      // Transform the data to match the expected structure
      const transformedData = data.map(subject => ({
        id: subject.id,
        name_en: subject.name_en,
        name_fr: subject.name_fr,
        name_lb: subject.name_lb
      }));

      return transformedData;
    },
  });
};