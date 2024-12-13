import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, User, Book, GraduationCap, Euro } from "lucide-react";
import { formatPrice, getLocalizedName } from "@/utils/teacherUtils";

interface TeacherCard2Props {
  teacher: any;
  language: string;
}

export const TeacherCard2 = ({ teacher, language }: TeacherCard2Props) => {
  const { t } = useLanguage();

  const getTeacherLocation = () => {
    if (!teacher.city) return '';
    const cityName = getLocalizedName(teacher.city, language);
    const regionName = getLocalizedName(teacher.city.region, language);
    return `${cityName}, ${regionName}`;
  };

  return (
    <Card className="p-6 flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      {/* Header Section */}
      <div className="flex items-start gap-4">
        <Avatar className="w-24 h-24 rounded-xl border-4 border-purple-soft">
          {teacher.profile_picture_url ? (
            <AvatarImage 
              src={teacher.profile_picture_url}
              alt={`${teacher.first_name} ${teacher.last_name}`}
              className="aspect-square h-full w-full object-cover"
            />
          ) : (
            <AvatarFallback className="bg-primary/5">
              <User className="w-12 h-12 text-primary/50" />
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
              {getLocalizedName(subjectData.subject, language)}
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
              {level.school_level}
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
              {cityData.city_name}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};