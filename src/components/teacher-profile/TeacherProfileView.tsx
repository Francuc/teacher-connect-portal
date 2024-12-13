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
import { SubscriptionSection } from "./SubscriptionSection";
import { useAuth } from "@/hooks/useAuth";

interface TeacherProfileViewProps {
  userId: string;
}

export const TeacherProfileView = ({ userId }: TeacherProfileViewProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { session } = useAuth();
  const isOwnProfile = session?.user?.id === userId;

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

        return data;
      } catch (error) {
        console.error('Error in fetchTeacherData:', error);
        throw error;
      }
    },
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
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  const handleEditClick = () => {
    navigate(`/profile/edit/${userId}`);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {isOwnProfile && (
        <div className="flex justify-end mb-6">
          <Button onClick={handleEditClick} className="flex items-center gap-2">
            <Pencil className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PersonalSection profile={profile} />
          {isOwnProfile && (
            <SubscriptionSection 
              profile={profile} 
              isOwnProfile={true}
            />
          )}
        </div>
        <BiographySection bio={profile.bio} />
        <SubjectsSection subjects={profile.teacher_subjects} />
        <SchoolLevelsSection schoolLevels={profile.teacher_school_levels?.map((level: any) => level.school_level) || []} />
        <LocationsSection
          locations={profile.teacher_locations}
          city={profile.city}
          studentRegions={profile.teacher_student_regions?.map((r: any) => r.region_name) || []}
          studentCities={profile.teacher_student_cities?.map((c: any) => getLocalizedName(c.cities)) || []}
        />
      </div>
    </div>
  );
};