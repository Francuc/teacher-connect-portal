import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { TeachingLocation } from "@/lib/constants";

type TeacherProfile = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  facebook_profile: string | null;
  show_email: boolean;
  show_phone: boolean;
  show_facebook: boolean;
  bio: string;
  profile_picture_url: string | null;
  locations: {
    location_type: TeachingLocation;
    price_per_hour: number;
  }[];
  subjects: string[];
  school_levels: string[];
  city: {
    name_en: string;
    name_fr: string;
    name_lb: string;
    region: {
      name_en: string;
      name_fr: string;
      name_lb: string;
    };
  } | null;
};

export const TeacherProfileView = ({ userId }: { userId: string }) => {
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select(`
          *,
          city:cities(
            name_en,
            name_fr,
            name_lb,
            region:regions(
              name_en,
              name_fr,
              name_lb
            )
          )
        `)
        .eq('user_id', userId)
        .single();

      if (teacherError) {
        console.error('Error fetching teacher:', teacherError);
        return;
      }

      const { data: locations } = await supabase
        .from('teacher_locations')
        .select('*')
        .eq('teacher_id', userId);

      const { data: subjects } = await supabase
        .from('teacher_subjects')
        .select('subject')
        .eq('teacher_id', userId);

      const { data: schoolLevels } = await supabase
        .from('teacher_school_levels')
        .select('school_level')
        .eq('teacher_id', userId);

      setProfile({
        ...teacherData,
        locations: locations || [],
        subjects: subjects?.map(s => s.subject) || [],
        school_levels: schoolLevels?.map(l => l.school_level) || []
      });
    };

    fetchProfile();
  }, [userId]);

  if (!profile) {
    return <div>{t("loading")}</div>;
  }

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("personalInformation")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <h3 className="font-semibold">{t("name")}</h3>
              <p>{`${profile.first_name} ${profile.last_name}`}</p>
            </div>
            {profile.show_email && (
              <div>
                <h3 className="font-semibold">{t("email")}</h3>
                <p>{profile.email}</p>
              </div>
            )}
            {profile.show_phone && profile.phone && (
              <div>
                <h3 className="font-semibold">{t("phone")}</h3>
                <p>{profile.phone}</p>
              </div>
            )}
            {profile.show_facebook && profile.facebook_profile && (
              <div>
                <h3 className="font-semibold">{t("facebookProfile")}</h3>
                <p>{profile.facebook_profile}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("teachingLocations")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {profile.locations.map((location, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{location.location_type}</span>
                <span className="font-semibold">€{location.price_per_hour}/h</span>
              </div>
            ))}
            {profile.city && (
              <div>
                <h3 className="font-semibold">{t("teacherLocation")}</h3>
                <p>{`${getLocalizedName(profile.city)}, ${getLocalizedName(profile.city.region)}`}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("subjects")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.subjects.map((subject, index) => (
              <span key={index} className="bg-primary/10 px-2 py-1 rounded">
                {subject}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("schoolLevels")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.school_levels.map((level, index) => (
              <span key={index} className="bg-primary/10 px-2 py-1 rounded">
                {level}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("biography")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{profile.bio}</p>
        </CardContent>
      </Card>
    </div>
  );
};