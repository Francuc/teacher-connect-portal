import { useParams, useNavigate } from "react-router-dom";
import { TeacherProfileView } from "./teacher-profile/TeacherProfileView";
import { FormContainer } from "./teacher-profile/form/FormContainer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const TeacherProfileForm = () => {
  const { userId, subject, teacherName } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const path = window.location.pathname;
  const isViewMode = !path.includes('/new') && !path.includes('/edit');
  
  console.log('TeacherProfileForm - Current path:', path);
  console.log('TeacherProfileForm - UserId:', userId);
  console.log('TeacherProfileForm - Is view mode:', isViewMode);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['teacherProfile', userId],
    queryFn: async () => {
      console.log('Fetching teacher data for userId:', userId);
      try {
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
          .eq('user_id', userId)
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
    enabled: !!userId,
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
        navigate(`/${prefix}/edit/${userId}`);
      }
    }
  }, [profile, isViewMode, userId, navigate, language]);
  
  if (isViewMode) {
    return <TeacherProfileView userId={userId || ''} />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <FormContainer userId={userId} initialData={profile} />
    </div>
  );
};

export default TeacherProfileForm;