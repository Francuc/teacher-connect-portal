import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, MapPin, GraduationCap, BookOpen, Euro, Mail, Phone, Facebook } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const lowestPrice = getLowestPrice(teacher.teacher_locations);

  const studentPlaceLocation = teacher.teacher_locations?.find(
    (loc: any) => loc.location_type === "Student's Place"
  );

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border border-purple.soft rounded-2xl overflow-hidden">
      <div className="p-8 flex flex-col h-full space-y-6">
        <div className="flex items-start gap-6">
          <Avatar className="w-28 h-28 rounded-2xl border-2 border-primary/20">
            {teacher.profile_picture_url ? (
              <AvatarImage 
                src={teacher.profile_picture_url} 
                alt={`${teacher.first_name} ${teacher.last_name}`}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-primary/5">
                <User className="w-14 h-14 text-primary/50" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-semibold text-purple.dark truncate group-hover:text-primary transition-colors">
              {teacher.first_name} {teacher.last_name}
            </h3>
            <p className="text-base text-muted-foreground flex items-center gap-2 mt-2">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{getTeacherLocation(teacher)}</span>
            </p>
            
            {/* Contact Information */}
            <div className="mt-4 space-y-2">
              {teacher.show_email && teacher.email && (
                <a 
                  href={`mailto:${teacher.email}`}
                  className="text-base text-primary hover:text-primary/90 flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  {teacher.email}
                </a>
              )}
              {teacher.show_phone && teacher.phone && (
                <a 
                  href={`tel:${teacher.phone}`}
                  className="text-base text-primary hover:text-primary/90 flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  {teacher.phone}
                </a>
              )}
              {teacher.show_facebook && teacher.facebook_profile && (
                <a 
                  href={teacher.facebook_profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-primary hover:text-primary/90 flex items-center gap-2"
                >
                  <Facebook className="w-5 h-5" />
                  {t("facebookProfile")}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <BookOpen className="w-5 h-5" />
              <span>{t("subjects")}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {teacher.teacher_subjects?.slice(0, 3).map((subject: any) => (
                <span
                  key={subject.subject.id}
                  className="text-sm px-4 py-2 rounded-full bg-primary/10 text-primary font-medium"
                >
                  {getLocalizedName(subject.subject)}
                </span>
              ))}
              {teacher.teacher_subjects?.length > 3 && (
                <span className="text-sm px-4 py-2 rounded-full bg-secondary/10 text-secondary font-medium">
                  +{teacher.teacher_subjects.length - 3}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <GraduationCap className="w-5 h-5" />
              <span>{t("schoolLevels")}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {teacher.teacher_school_levels?.slice(0, 2).map((level: any) => (
                <span
                  key={level.school_level}
                  className="text-sm px-4 py-2 rounded-full bg-accent/10 text-accent font-medium"
                >
                  {level.school_level}
                </span>
              ))}
              {teacher.teacher_school_levels?.length > 2 && (
                <span className="text-sm px-4 py-2 rounded-full bg-secondary/10 text-secondary font-medium">
                  +{teacher.teacher_school_levels.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Student Cities Section */}
          {studentPlaceLocation && teacher.teacher_student_cities?.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-base text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span>{t("availableIn")}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {teacher.teacher_student_cities.slice(0, 3).map((cityData: any) => (
                  <span
                    key={cityData.id}
                    className="text-sm px-4 py-2 rounded-full bg-primary/5 text-primary/90 font-medium"
                  >
                    {cityData.city_name}
                  </span>
                ))}
                {teacher.teacher_student_cities.length > 3 && (
                  <span className="text-sm px-4 py-2 rounded-full bg-secondary/10 text-secondary font-medium">
                    +{teacher.teacher_student_cities.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-6 mt-auto border-t border-purple.soft/30">
          {lowestPrice && (
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <Euro className="w-5 h-5" />
              <span>
                {t("startingFrom")} 
                <span className="font-semibold text-purple.dark ml-1">
                  {formatPrice(lowestPrice)}
                </span>
              </span>
            </div>
          )}
          <Button 
            onClick={() => navigate(`/profile/${teacher.user_id}`)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 text-base"
          >
            {t("viewProfile")}
          </Button>
        </div>
      </div>
    </Card>
  );
};