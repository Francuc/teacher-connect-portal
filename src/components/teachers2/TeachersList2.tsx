import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TeachersGrid2 } from "./TeachersGrid2";
import { useLanguage } from "@/contexts/LanguageContext";

interface TeachersList2Props {
  selectedSubject?: string;
  selectedCity?: string;
  showOnlineOnly?: boolean;
}

export const TeachersList2 = ({ 
  selectedSubject = "all",
  selectedCity = "all",
  showOnlineOnly = false
}: TeachersList2Props) => {
  const { language } = useLanguage();

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["teachers2", selectedSubject, selectedCity, showOnlineOnly],
    queryFn: async () => {
      console.log("Fetching teachers with filters:", { selectedSubject, selectedCity, showOnlineOnly });
      
      let query = supabase
        .from('teachers')
        .select(`
          *,
          city:cities!left (*,
            region:regions!left (*)
          ),
          teacher_subjects!left (
            subject:subjects!left (*)
          ),
          teacher_school_levels!left (
            school_level
          ),
          teacher_locations!left (
            location_type,
            price_per_hour
          ),
          teacher_student_cities!left (
            city_name
          )
        `)
        .eq('subscription_status', 'active')
        .order('subscription_end_date', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching teachers:", error);
        throw error;
      }

      // Filter and sort teachers based on the selected filters
      let filteredTeachers = data || [];

      // Apply subject filter
      if (selectedSubject !== "all") {
        filteredTeachers = filteredTeachers.filter(teacher => 
          teacher.teacher_subjects?.some((s: any) => s.subject?.id === selectedSubject)
        );
      }

      // Apply city and online filters
      if (selectedCity !== "all" || showOnlineOnly) {
        filteredTeachers = filteredTeachers.filter(teacher => {
          const hasOnlineTeaching = teacher.teacher_locations?.some(
            (loc: any) => loc.location_type === "Online"
          );

          // If showing online only, teacher must offer online teaching
          if (showOnlineOnly && !hasOnlineTeaching) {
            return false;
          }

          // If city is selected and not showing online only
          if (selectedCity !== "all" && !showOnlineOnly) {
            // Check if teacher is in the selected city or serves students there
            const isInCity = teacher.city?.id === selectedCity;
            const servesCity = teacher.teacher_student_cities?.some(
              (sc: any) => sc.city_name === selectedCity
            );
            return isInCity || servesCity;
          }

          // If showing online only and city is selected
          if (selectedCity !== "all" && showOnlineOnly && hasOnlineTeaching) {
            const isInCity = teacher.city?.id === selectedCity;
            const servesCity = teacher.teacher_student_cities?.some(
              (sc: any) => sc.city_name === selectedCity
            );
            return isInCity || servesCity || hasOnlineTeaching;
          }

          return true;
        });
      }

      // Sort teachers: matching filters first, then by subscription end date
      return filteredTeachers.sort((a, b) => {
        const aDate = new Date(a.subscription_end_date || 0);
        const bDate = new Date(b.subscription_end_date || 0);
        return bDate.getTime() - aDate.getTime();
      });
    }
  });

  return (
    <div className="container mx-auto px-4">
      <TeachersGrid2 
        teachers={teachers}
        isLoading={isLoading}
        language={language}
        selectedSubject={selectedSubject}
      />
    </div>
  );
};