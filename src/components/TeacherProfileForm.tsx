import { useParams, useNavigate } from "react-router-dom";
import { TeacherProfileView } from "./teacher-profile/TeacherProfileView";
import { FormContainer } from "./teacher-profile/form/FormContainer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

const TeacherProfileForm = () => {
  const { teacherName, subject } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { session } = useAuth();
  const path = window.location.pathname;
  const isViewMode = !path.includes('/edit');
  
  console.log('TeacherProfileForm - Current path:', path);
  console.log('TeacherProfileForm - Teacher Name:', teacherName);
  console.log('TeacherProfileForm - Is view mode:', isViewMode);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['teacherProfile', teacherName],
    queryFn: async () => {
      if (!teacherName) {
        console.log('No teacher name provided, skipping fetch');
        return null;
      }

      console.log('Fetching teacher data for teacher:', teacherName);
      try {
        // For edit routes, teacherName might be the user_id
        let query = supabase
          .from('teachers')
          .select(`
            *,
            city:cities!left(
              *,
              region:regions!left(*)
            ),
            teacher_subjects!left(
              subject:subjects!left(*)
            ),
            teacher_school_levels!left(
              school_level
            ),
            teacher_locations!left(
              location_type,
              price_per_hour
            ),
            teacher_student_regions!left(
              region_name
            ),
            teacher_student_cities!left(
              cities!left(
                id,
                name_en,
                name_fr,
                name_lb
              )
            )
          `);

        // If we're on the edit page or viewing own profile, search by user_id
        if (path.includes('/edit') || teacherName === session?.user?.id) {
          query = query.eq('user_id', teacherName);
        } else {
          // Find the last occurrence of hyphen to separate first and last name
          const lastHyphenIndex = teacherName.lastIndexOf('-');
          const firstName = teacherName.substring(0, lastHyphenIndex).replace(/-/g, ' ');
          const lastName = teacherName.substring(lastHyphenIndex + 1).replace(/-/g, ' ');
          query = query.ilike('first_name', firstName).ilike('last_name', lastName);
        }

        const { data, error } = await query.maybeSingle();

        if (error) {
          console.error('Error fetching teacher profile:', error);
          throw error;
        }

        console.log('Teacher profile fetched:', data);
        return data;
      } catch (error) {
        console.error('Error in fetchTeacherData:', error);
        throw error;
      }
    },
    enabled: !!teacherName,
  });

  useEffect(() => {
    if (profile && isViewMode) {
      // Check if the profile was created within the last 20 seconds
      const createdAt = new Date(profile.created_at);
      const now = new Date();
      const timeDifference = now.getTime() - createdAt.getTime();
      const secondsDifference = timeDifference / 1000;

      if (secondsDifference <= 20) {
        console.log('New profile detected, redirecting to edit page');
        const prefix = language === 'fr' ? 'cours-de-rattrapage' : language === 'lb' ? 'nohellef' : 'tutoring';
        navigate(`/${prefix}/edit`);
      }
    }
  }, [profile, isViewMode, navigate, language]);
  
  if (isViewMode) {
    if (!profile && !isLoading) {
      return <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center">Teacher not found</h1>
      </div>;
    }
    return <TeacherProfileView userId={profile?.user_id || ''} />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <FormContainer userId={profile?.user_id} initialData={profile} />
    </div>
  );
};

export default TeacherProfileForm;