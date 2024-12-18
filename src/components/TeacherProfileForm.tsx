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
  const isViewMode = !path.includes('/new') && !path.includes('/edit');
  
  console.log('TeacherProfileForm - Current path:', path);
  console.log('TeacherProfileForm - Teacher Name:', teacherName);
  console.log('TeacherProfileForm - Is view mode:', isViewMode);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['teacherProfile', teacherName],
    queryFn: async () => {
      console.log('Fetching teacher data for teacher:', teacherName);
      try {
        const names = teacherName?.split('-') || [];
        const firstName = names[0];
        const lastName = names.slice(1).join(' ');

        const { data, error } = await supabase
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
          `)
          .eq('first_name', firstName)
          .eq('last_name', lastName)
          .maybeSingle();

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