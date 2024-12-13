import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TeachersGrid2 } from "./TeachersGrid2";
import { useLanguage } from "@/contexts/LanguageContext";

interface TeachersList2Props {
  selectedSubject?: string;
  selectedCity?: string;
}

export const TeachersList2 = ({ 
  selectedSubject = "all",
  selectedCity = "all"
}: TeachersList2Props) => {
  const { language } = useLanguage();

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["teachers2", selectedSubject, selectedCity],
    queryFn: async () => {
      console.log("Fetching teachers with filters:", { selectedSubject, selectedCity });
      
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

      // Apply city filter
      if (selectedCity !== "all") {
        filteredTeachers = filteredTeachers.filter(teacher => {
          // Check teacher's own city
          if (teacher.city?.id === selectedCity) return true;
          
          // Check cities where teacher serves students
          return teacher.teacher_student_cities?.some(
            (sc: any) => sc.city_name === selectedCity
          );
        });
      }

      // Sort teachers: matching filters first, then by subscription end date
      return filteredTeachers.sort((a, b) => {
        const aMatches = selectedSubject === "all" || 
          a.teacher_subjects?.some((s: any) => s.subject?.id === selectedSubject);
        const bMatches = selectedSubject === "all" || 
          b.teacher_subjects?.some((s: any) => s.subject?.id === selectedSubject);

        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;

        // If both match or don't match, sort by subscription end date
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