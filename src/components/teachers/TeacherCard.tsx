import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, User, GraduationCap, BookOpen, Euro } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

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
  const [imageError, setImageError] = useState(false);
  const lowestPrice = getLowestPrice(teacher.teacher_locations || []);

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      <div className="p-6 flex flex-col h-full space-y-6">
        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 rounded-full border-4 border-purple-soft">
            {teacher.profile_picture_url && !imageError ? (
              <AvatarImage 
                src={teacher.profile_picture_url}
                alt={`${teacher.first_name} ${teacher.last_name}`}
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <AvatarFallback className="bg-purple-soft">
                <User className="w-10 h-10 text-purple-vivid" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-purple-dark">
              {teacher.first_name} {teacher.last_name}
            </h3>
            {lowestPrice && (
              <div className="flex items-center gap-1 text-green-600 font-semibold">
                <Euro className="w-4 h-4" />
                <span>{formatPrice(lowestPrice)}/h</span>
              </div>
            )}
          </div>
        </div>

        {/* Subjects Section */}
        {teacher.teacher_subjects && teacher.teacher_subjects.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>{t("subjects")}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {teacher.teacher_subjects.slice(0, 3).map((subjectData: any) => (
                <span
                  key={subjectData.id}
                  className="px-3 py-1 bg-purple-soft text-purple-vivid rounded-full text-sm font-medium"
                >
                  {getLocalizedName(subjectData.subject)}
                </span>
              ))}
              {teacher.teacher_subjects.length > 3 && (
                <span className="px-3 py-1 bg-purple-soft/50 text-purple-vivid rounded-full text-sm font-medium">
                  +{teacher.teacher_subjects.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* School Levels Section */}
        {teacher.teacher_school_levels && teacher.teacher_school_levels.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
              <span>{t("schoolLevels")}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {teacher.teacher_school_levels.slice(0, 3).map((level: any) => (
                <span
                  key={level.id}
                  className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                >
                  {level.school_level}
                </span>
              ))}
              {teacher.teacher_school_levels.length > 3 && (
                <span className="px-3 py-1 bg-accent/5 text-accent rounded-full text-sm font-medium">
                  +{teacher.teacher_school_levels.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Teaching Locations Section */}
        <div className="space-y-4">
          {/* Teacher's Place */}
          {teacher.city && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{t("teacherPlace")}</span>
              </div>
              <div className="text-sm text-purple-dark">
                {getTeacherLocation(teacher)}
              </div>
            </div>
          )}

          {/* Student's Place */}
          {teacher.teacher_student_cities && teacher.teacher_student_cities.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{t("studentPlace")}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {teacher.teacher_student_cities.map((cityData: any) => (
                  <span
                    key={cityData.id}
                    className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                  >
                    {cityData.city_name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          {teacher.show_email && teacher.email && (
            <p className="text-sm text-muted-foreground">
              {t("email")}: {teacher.email}
            </p>
          )}
          {teacher.show_phone && teacher.phone && (
            <p className="text-sm text-muted-foreground">
              {t("phone")}: {teacher.phone}
            </p>
          )}
        </div>

        {/* Footer with Action Button */}
        <div className="mt-auto pt-4 border-t flex justify-between items-center">
          {lowestPrice && (
            <div className="text-lg font-semibold text-green-600">
              {t("startingAt")} {formatPrice(lowestPrice)}/h
            </div>
          )}
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