import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, User, Book, GraduationCap, Euro } from "lucide-react";
import { formatPrice } from "@/utils/teacherUtils";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

interface TeacherCard2Props {
  teacher: any;
}

export const TeacherCard2 = ({ teacher }: TeacherCard2Props) => {
  const { t, language } = useLanguage();

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

  const { data: cities = [] } = useQuery({
    queryKey: ['teacherCities', teacher.teacher_student_cities],
    queryFn: async () => {
      if (!teacher.teacher_student_cities?.length) return [];
      
      const cityNames = teacher.teacher_student_cities.map((c: any) => c.city_name);
      const { data, error } = await supabase
        .from('cities')
        .select(`
          *,
          region:regions(*)
        `)
        .in('name_en', cityNames);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!teacher.teacher_student_cities?.length
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
    const regionName = getLocalizedName(teacher.city.region);
    return `${cityName}, ${regionName}`;
  };

  const getTranslatedLevel = (levelName: string) => {
    const level = schoolLevels.find(l => l.name_en === levelName);
    if (level) {
      return getLocalizedName(level);
    }
    return levelName;
  };

  const getTranslatedCityName = (cityName: string) => {
    const city = cities.find(c => c.name_en === cityName);
    if (city) {
      return getLocalizedName(city);
    }
    return cityName;
  };

  // Get the full URL for the profile picture
  const getProfilePictureUrl = () => {
    if (!teacher.profile_picture_url) return null;
    const { data: { publicUrl } } = supabase
      .storage
      .from('profile-pictures')
      .getPublicUrl(teacher.profile_picture_url);
    return publicUrl;
  };

  return (
    <Card className="p-6 flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      {/* Header Section */}
      <div className="flex items-start gap-4">
        <Avatar className="w-24 h-24 rounded-xl border-4 border-purple-soft">
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
        <div>
          <h3 className="text-xl font-semibold text-purple-dark">
            {teacher.first_name} {teacher.last_name}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <MapPin className="w-4 h-4" />
            {getTeacherLocation()}
          </p>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Subjects Section */}
      <div className="space-y-2 mb-4">
        <h4 className="font-semibold flex items-center gap-2">
          <Book className="w-4 h-4" />
          {t("subjects")}
        </h4>
        <div className="flex flex-wrap gap-2">
          {teacher.teacher_subjects?.map((subjectData: any) => (
            <Badge
              key={subjectData.subject.id}
              variant="outline"
              className="bg-primary/10 text-primary border-none"
            >
              {getLocalizedName(subjectData.subject)}
            </Badge>
          ))}
        </div>
      </div>

      {/* School Levels Section */}
      <div className="space-y-2 mb-4">
        <h4 className="font-semibold flex items-center gap-2">
          <GraduationCap className="w-4 h-4" />
          {t("schoolLevels")}
        </h4>
        <div className="flex flex-wrap gap-2">
          {teacher.teacher_school_levels?.map((level: any, index: number) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-accent/10 text-accent border-none"
            >
              {getTranslatedLevel(level.school_level)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Teaching Locations Section */}
      <div className="space-y-2 mb-4">
        <h4 className="font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {t("teachingLocations")}
        </h4>
        <div className="flex flex-wrap gap-2">
          {teacher.teacher_locations?.map((location: any, index: number) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-secondary/10 text-secondary border-none flex items-center gap-2"
            >
              <span>{t(location.location_type)}</span>
              <span className="font-semibold flex items-center">
                <Euro className="w-3 h-3 mr-1" />
                {formatPrice(location.price_per_hour)}
              </span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Student Cities Section */}
      <div className="space-y-2">
        <h4 className="font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {t("availableIn")}
        </h4>
        <div className="flex flex-wrap gap-2">
          {teacher.teacher_student_cities?.map((cityData: any, index: number) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-purple-soft text-purple-vivid border-none"
            >
              {getTranslatedCityName(cityData.city_name)}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};