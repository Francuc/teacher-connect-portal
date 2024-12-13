import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, User, GraduationCap, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      <div className="p-6 flex flex-col h-full space-y-6">
        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 rounded-full border-4 border-purple-soft">
            {teacher.profile_picture_url ? (
              <AvatarImage 
                src={teacher.profile_picture_url} 
                alt={`${teacher.first_name} ${teacher.last_name}`}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-purple-soft">
                <User className="w-10 h-10 text-purple-vivid" />
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="text-xl font-bold text-purple-dark">
              {teacher.first_name} {teacher.last_name}
            </h3>
            {teacher.city && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {getLocalizedName(teacher.city)}
              </p>
            )}
          </div>
        </div>

        {/* Bio Preview */}
        {teacher.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {teacher.bio}
          </p>
        )}

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
                  key={subjectData.subject.id}
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

        {/* Price Range */}
        {lowestPrice && (
          <div className="flex items-center justify-end gap-2 text-purple-vivid font-semibold">
            {t("startingAt")} {formatPrice(lowestPrice)}
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