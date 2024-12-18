import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { PersonalSection } from "./profile-sections/PersonalSection";
import { BiographySection } from "./profile-sections/BiographySection";
import { SubjectsSection } from "./profile-sections/SubjectsSection";
import { SchoolLevelsSection } from "./profile-sections/SchoolLevelsSection";
import { LocationsSection } from "./profile-sections/LocationsSection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SubscriptionSection } from "./SubscriptionSection";

interface TeacherProfileViewProps {
  userId: string;
}

export const TeacherProfileView = ({ userId }: TeacherProfileViewProps) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { session } = useAuth();
  const isOwnProfile = session?.user?.id === userId;

  const { data: profile, isLoading } = useQuery({
    queryKey: ['teacherProfile', userId],
    queryFn: async () => {
      if (!userId) {
        console.log('No userId provided, skipping fetch');
        return null;
      }

      console.log('Fetching teacher data for userId:', userId);
      try {
        const { data, error } = await supabase
          .from('teachers')
          .select(`
            *,
            city:cities!left(
              id,
              name_en,
              name_fr,
              name_lb,
              region:regions!left(
                id,
                name_en,
                name_fr,
                name_lb
              )
            ),
            teacher_subjects!left(
              subject:subjects!left(
                id,
                name_en,
                name_fr,
                name_lb
              )
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

        if (data && data.profile_picture_url) {
          const { data: { publicUrl } } = supabase
            .storage
            .from('profile-pictures')
            .getPublicUrl(data.profile_picture_url);
          data.profile_picture_url = publicUrl;
        }

        return data;
      } catch (error) {
        console.error('Error in fetchTeacherData:', error);
        throw error;
      }
    },
    enabled: !!userId,
  });

  const getLocalizedName = (item: any) => {
    if (!item) return '';
    switch(language) {
      case 'fr':
        return item.name_fr;
      case 'lb':
        return item.name_lb;
      default:
        return item.name_en;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  if (!profile) {
    return <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">{t("profileNotFound")}</h1>
        <p className="text-gray-600">{t("profileNotFoundDescription")}</p>
      </div>
    </div>;
  }

  const handleEditClick = () => {
    navigate(`/profile/edit/${userId}`);
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      {isOwnProfile && (
        <div className="flex justify-end mb-4">
          <Button onClick={handleEditClick} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <Pencil className="w-4 h-4" />
            {t("editProfile")}
          </Button>
        </div>
      )}

      <div className="space-y-4 bg-purple.soft/5 rounded-xl p-4 shadow-lg border border-purple.soft/20">
        {isOwnProfile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <PersonalSection profile={profile} />
            <SubscriptionSection 
              profile={profile} 
              isOwnProfile={isOwnProfile} 
            />
          </div>
        ) : (
          <PersonalSection profile={profile} />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <BiographySection bio={profile.bio} />
            <SubjectsSection subjects={profile.teacher_subjects} />
          </div>
          
          <div className="space-y-4">
            <SchoolLevelsSection schoolLevels={profile.teacher_school_levels?.map((level: any) => level.school_level) || []} />
            <LocationsSection
              locations={profile.teacher_locations}
              city={profile.city}
              studentRegions={profile.teacher_student_regions?.map((r: any) => r.region_name) || []}
              studentCities={profile.teacher_student_cities?.map((c: any) => getLocalizedName(c.cities)) || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};