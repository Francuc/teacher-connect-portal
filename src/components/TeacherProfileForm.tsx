import { useParams } from "react-router-dom";
import { TeacherProfileView } from "./teacher-profile/TeacherProfileView";
import { FormContainer } from "./teacher-profile/form/FormContainer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SubscriptionSection } from "./teacher-profile/SubscriptionSection";

const TeacherProfileForm = () => {
  const { userId } = useParams();
  const path = window.location.pathname;
  const isViewMode = path.includes('/profile/') && !path.includes('/new') && !path.includes('/edit');
  
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
  
  if (isViewMode) {
    return <TeacherProfileView userId={userId || ''} />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isOwnProfile = true; // For edit mode, this is always true

  return (
    <div className="space-y-8">
      <FormContainer userId={userId} initialData={profile} />
      <SubscriptionSection profile={profile} isOwnProfile={isOwnProfile} />
    </div>
  );
};

export default TeacherProfileForm;