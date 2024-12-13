import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, User, GraduationCap, BookOpen, Euro, Phone, Mail, Facebook } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface TeacherCardProps {
  teacher: any;
  getLocalizedName: (item: any) => string;
  getTeacherLocation: (teacher: any) => string;
  getLowestPrice: (locations: any[]) => number | null;
  formatPrice: (price: number) => string;
}

export const TeacherCard = ({
  teacher,
  getLocalizedName,
  getTeacherLocation,
  getLowestPrice,
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
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-purple-soft">
                <User className="w-12 h-12 text-purple-vivid" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-purple-dark">
              {teacher.first_name} {teacher.last_name}
            </h3>
            {teacher.city && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {getLocalizedName(teacher.city)}
              </p>
            )}
            
            {/* Contact Information */}
            <div className="mt-2 space-y-1">
              {teacher.show_email && teacher.email && (
                <p className="text-sm flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {teacher.email}
                </p>
              )}
              {teacher.show_phone && teacher.phone && (
                <p className="text-sm flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {teacher.phone}
                </p>
              )}
              {teacher.show_facebook && teacher.facebook_profile && (
                <p className="text-sm flex items-center gap-2 text-muted-foreground">
                  <Facebook className="w-4 h-4" />
                  {teacher.facebook_profile}
                </p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Bio Section */}
        {teacher.bio && (
          <div>
            <h4 className="font-semibold mb-2">{t("biography")}</h4>
            <p className="text-sm text-muted-foreground">{teacher.bio}</p>
          </div>
        )}

        {/* Teaching Locations and Prices */}
        {teacher.teacher_locations && teacher.teacher_locations.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">{t("teachingLocations")}</h4>
            <div className="space-y-2">
              {teacher.teacher_locations.map((location: any) => (
                <div key={location.id} className="flex justify-between items-center text-sm">
                  <span>{location.location_type}</span>
                  <div className="flex items-center gap-1 text-purple-vivid">
                    <Euro className="w-4 h-4" />
                    <span>{formatPrice(location.price_per_hour)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subjects Section */}
        {teacher.teacher_subjects && teacher.teacher_subjects.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {t("subjects")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {teacher.teacher_subjects.map((subjectData: any) => (
                <span
                  key={subjectData.subject.id}
                  className="px-3 py-1 bg-purple-soft text-purple-vivid rounded-full text-sm font-medium"
                >
                  {getLocalizedName(subjectData.subject)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* School Levels Section */}
        {teacher.teacher_school_levels && teacher.teacher_school_levels.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              {t("schoolLevels")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {teacher.teacher_school_levels.map((level: any) => (
                <span
                  key={level.id}
                  className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                >
                  {level.school_level}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Student Cities Section */}
        {teacher.teacher_student_cities && teacher.teacher_student_cities.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {t("availableIn")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {teacher.teacher_student_cities.map((cityData: any) => (
                <span
                  key={cityData.id}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {cityData.city_name}
                </span>
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