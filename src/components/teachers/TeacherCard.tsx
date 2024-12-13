import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, User, BookOpen, GraduationCap, Euro } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeacherContact } from "./card/TeacherContact";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface TeacherCardProps {
  teacher: any;
  getLocalizedName: (item: any) => string;
  formatPrice: (price: number) => string;
}

export const TeacherCard = ({
  teacher,
  getLocalizedName,
  formatPrice,
}: TeacherCardProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      <div className="p-6 flex flex-col h-full space-y-4">
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
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-purple-dark truncate">
              {teacher.first_name} {teacher.last_name}
            </h3>
            
            {/* Location Information */}
            {teacher.city && (
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>
                  {getLocalizedName(teacher.city)}, {getLocalizedName(teacher.city.region)}
                </span>
              </p>
            )}
            
            {/* Contact Information */}
            <TeacherContact
              email={teacher.email}
              phone={teacher.phone}
              showEmail={teacher.show_email}
              showPhone={teacher.show_phone}
              showFacebook={teacher.show_facebook}
              facebookProfile={teacher.facebook_profile}
            />
          </div>
        </div>

        <Separator />

        {/* Teaching Locations and Prices */}
        {teacher.teacher_locations && teacher.teacher_locations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {t("teachingLocations")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {teacher.teacher_locations.map((location: any) => (
                <Badge
                  key={location.id}
                  variant="outline"
                  className="bg-primary/10 text-primary border-none flex items-center gap-2"
                >
                  <span>{location.location_type}</span>
                  <span className="font-semibold flex items-center">
                    <Euro className="w-3 h-3 mr-1" />
                    {formatPrice(location.price_per_hour)}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Subjects */}
        {teacher.teacher_subjects && teacher.teacher_subjects.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {t("subjects")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {teacher.teacher_subjects.map((subjectData: any) => (
                <Badge
                  key={subjectData.subject_id}
                  variant="outline"
                  className="bg-accent/10 text-accent border-none"
                >
                  {getLocalizedName(subjectData.subject)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* School Levels */}
        {teacher.teacher_school_levels && teacher.teacher_school_levels.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              {t("schoolLevels")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {teacher.teacher_school_levels.map((level: any, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-secondary/10 text-secondary border-none"
                >
                  {level.school_level}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Student Cities */}
        {teacher.teacher_student_cities && teacher.teacher_student_cities.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {t("availableIn")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {teacher.teacher_student_cities.map((cityData: any, index: number) => (
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
        )}

        {/* View Profile Button */}
        <div className="mt-auto pt-4 border-t flex justify-end">
          <Button 
            onClick={() => navigate(`/profile/${teacher.user_id}`)}
            className="bg-purple-vivid hover:bg-purple-vivid/90 text-white"
          >
            {t("viewProfile")}
          </Button>
        </div>
      </div>
    </Card>
  );
};