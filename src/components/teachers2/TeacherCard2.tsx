import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, Book, GraduationCap, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { TeacherLocations } from "./card/TeacherLocations";
import { TeacherContactInfo } from "./card/TeacherContactInfo";
import { Section } from "./card/Section";
import { SectionHeader } from "./card/SectionHeader";
import { TeacherCities } from "./card/TeacherCities";
import { TeacherAvailableCities } from "./card/TeacherAvailableCities";
import { useNavigate } from "react-router-dom";

interface TeacherCard2Props {
  teacher: any;
  isDisabled?: boolean;
}

export const TeacherCard2 = ({ teacher, isDisabled = false }: TeacherCard2Props) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const { data: schoolLevels = [] } = useQuery({
    queryKey: ['schoolLevels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_levels')
        .select('*')
        .order('name_en');
      if (error) throw error;
      return data;
    }
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

  const getTeacherLocation = () => {
    if (!teacher.city) return '';
    const cityName = getLocalizedName(teacher.city);
    const regionName = teacher.city.region ? getLocalizedName(teacher.city.region) : '';
    return regionName ? `${cityName}, ${regionName}` : cityName;
  };

  const getTranslatedLevel = (levelName: string) => {
    const level = schoolLevels.find(l => l.name_en === levelName);
    if (level) {
      return getLocalizedName(level);
    }
    return levelName;
  };

  const getProfilePictureUrl = () => {
    if (!teacher.profile_picture_url) return null;
    const { data: { publicUrl } } = supabase
      .storage
      .from('profile-pictures')
      .getPublicUrl(teacher.profile_picture_url);
    return publicUrl;
  };

  const handleCardClick = () => {
    const prefix = language === 'fr' ? 'cours-de-rattrapage' : language === 'lb' ? 'nohellef' : 'tutoring';
    const mainSubject = teacher.teacher_subjects?.[0]?.subject;
    const subjectName = mainSubject ? getLocalizedName(mainSubject).toLowerCase().replace(/\s+/g, '-') : 'general';
    const teacherName = `${teacher.first_name}-${teacher.last_name}`.toLowerCase().replace(/\s+/g, '-');
    const url = `/${prefix}/${subjectName}/${teacherName}/${teacher.user_id}`;
    navigate(url);
    window.scrollTo(0, 0);
  };

  return (
    <Card 
      className={`p-2 flex flex-col h-[472px] cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-primary/20 ${
        isDisabled ? 'opacity-50 pointer-events-none grayscale' : 'cursor-pointer'
      }`}
      onClick={isDisabled ? undefined : handleCardClick}
    >
      {/* Header Section */}
      <div className="h-[120px] flex items-start gap-3 mb-3">
        <Avatar className="w-[110px] h-[110px] rounded-lg border border-purple-soft/30">
          {teacher.profile_picture_url ? (
            <AvatarImage 
              src={getProfilePictureUrl()}
              alt={`${teacher.first_name} ${teacher.last_name}`}
              className="aspect-square h-full w-full object-cover"
            />
          ) : (
            <AvatarFallback className="bg-primary/5">
              <User 
                className="w-12 h-12 text-primary/50"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-purple-dark truncate">
            {teacher.first_name} {teacher.last_name}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <MapPin className="w-4 h-4" />
            {getTeacherLocation()}
          </p>
          <TeacherContactInfo
            email={teacher.email}
            phone={teacher.phone}
            facebookProfile={teacher.facebook_profile}
            showEmail={teacher.show_email}
            showPhone={teacher.show_phone}
            showFacebook={teacher.show_facebook}
          />
        </div>
      </div>

      <Separator className="my-2" />

      <div className="grid grid-cols-1 gap-3 flex-1">
        {/* Subjects Section */}
        {teacher.teacher_subjects && teacher.teacher_subjects.length > 0 && (
          <Section>
            <SectionHeader icon={Book} title={t("subjects")} />
            <div className="flex flex-wrap gap-1 mt-1">
              {teacher.teacher_subjects.map((subjectData: any) => (
                subjectData.subject && (
                  <Badge
                    key={subjectData.subject.id}
                    variant="outline"
                    className="bg-primary/10 text-primary border-none text-xs py-0"
                  >
                    {getLocalizedName(subjectData.subject)}
                  </Badge>
                )
              ))}
            </div>
          </Section>
        )}

        {/* School Levels Section */}
        {teacher.teacher_school_levels && teacher.teacher_school_levels.length > 0 && (
          <Section>
            <SectionHeader icon={GraduationCap} title={t("schoolLevels")} />
            <div className="flex flex-wrap gap-1 mt-1">
              {teacher.teacher_school_levels.map((level: any, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-primary/10 text-primary border-none text-xs py-0"
                >
                  {getTranslatedLevel(level.school_level)}
                </Badge>
              ))}
            </div>
          </Section>
        )}

        {/* Available Cities Section */}
        {teacher.teacher_student_cities && teacher.teacher_student_cities.length > 0 && (
          <TeacherAvailableCities 
            cities={teacher.teacher_student_cities}
            getLocalizedName={getLocalizedName}
          />
        )}

        {/* Teaching Locations Section */}
        {teacher.teacher_locations && teacher.teacher_locations.length > 0 && (
          <div className="mt-auto">
            <TeacherLocations locations={teacher.teacher_locations} />
          </div>
        )}
      </div>
    </Card>
  );
};
