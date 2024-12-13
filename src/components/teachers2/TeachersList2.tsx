import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TeachersGrid2 } from "./TeachersGrid2";
import { useLanguage } from "@/contexts/LanguageContext";

export const TeachersList2 = () => {
  const { language } = useLanguage();

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["teachers2"],
    queryFn: async () => {
      console.log("Fetching teachers data with all relations...");
      
      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers')
        .select(`
          *,
          city:cities!inner (
            *,
            region:regions!inner (*)
          ),
          teacher_subjects!inner (
            subject:subjects!inner (*)
          ),
          teacher_school_levels!inner (
            school_level
          ),
          teacher_locations!inner (
            location_type,
            price_per_hour
          ),
          teacher_student_cities!inner (
            city_name
          )
        `);

      if (teachersError) {
        console.error("Error fetching teachers:", teachersError);
        throw teachersError;
      }

      // Fetch all users from profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      // Map profiles to teachers or create placeholder teacher objects
      const allUsers = profilesData.map(profile => {
        const existingTeacher = teachersData?.find(t => t.user_id === profile.id);
        if (existingTeacher) {
          return existingTeacher;
        }
        // Return a placeholder teacher object for users without teacher profiles
        return {
          id: profile.id,
          user_id: profile.id,
          first_name: "New",
          last_name: "Teacher",
          email: "",
          bio: "No teacher profile yet",
          teacher_subjects: [],
          teacher_school_levels: [],
          teacher_locations: [],
          teacher_student_cities: [],
        };
      });

      console.log("All users data fetched:", allUsers?.length);
      return allUsers;
    }
  });

  return (
    <div className="container mx-auto px-4">
      <TeachersGrid2 
        teachers={teachers}
        isLoading={isLoading}
        language={language}
      />
    </div>
  );
};