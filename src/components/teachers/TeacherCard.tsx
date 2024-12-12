import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, MapPin, GraduationCap, BookOpen, Euro } from "lucide-react";
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

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-purple.soft">
      <div className="relative p-6 flex flex-col h-full">
        <div className="flex items-start gap-4">
          <Avatar className="w-24 h-24 rounded-xl border-2 border-primary/20">
            {teacher.profile_picture_url ? (
              <AvatarImage 
                src={teacher.profile_picture_url} 
                alt={`${teacher.first_name} ${teacher.last_name}`}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-primary/5">
                <User className="w-12 h-12 text-primary/50" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-purple.dark truncate group-hover:text-primary transition-colors">
              {teacher.first_name} {teacher.last_name}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{getTeacherLocation(teacher)}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4 flex-1">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>{t("subjects")}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {teacher.teacher_subjects?.slice(0, 3).map((subject: any) => (
                <span
                  key={subject.subject.id}
                  className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
                >
                  {getLocalizedName(subject.subject)}
                </span>
              ))}
              {teacher.teacher_subjects?.length > 3 && (
                <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary font-medium">
                  +{teacher.teacher_subjects.length - 3}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
              <span>{t("schoolLevels")}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {teacher.teacher_school_levels?.slice(0, 2).map((level: any) => (
                <span
                  key={level.school_level}
                  className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium"
                >
                  {level.school_level}
                </span>
              ))}
              {teacher.teacher_school_levels?.length > 2 && (
                <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary font-medium">
                  +{teacher.teacher_school_levels.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 mt-4 border-t border-purple.soft/30">
          {lowestPrice && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Euro className="w-4 h-4" />
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
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {t("viewProfile")}
          </Button>
        </div>
      </div>
    </Card>
  );
};