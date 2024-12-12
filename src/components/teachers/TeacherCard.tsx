import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, MapPin, GraduationCap, BookOpen } from "lucide-react";
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          {teacher.profile_picture_url ? (
            <AvatarImage src={teacher.profile_picture_url} alt={`${teacher.first_name} ${teacher.last_name}`} />
          ) : (
            <AvatarFallback>
              <User className="w-8 h-8" />
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            {teacher.first_name} {teacher.last_name}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {getTeacherLocation(teacher)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>{t("subjects")}:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {teacher.teacher_subjects?.map((subject: any) => (
              <span
                key={subject.subject.id}
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
              >
                {getLocalizedName(subject.subject)}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <GraduationCap className="w-4 h-4" />
            <span>{t("schoolLevels")}:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {teacher.teacher_school_levels?.map((level: any) => (
              <span
                key={level.school_level}
                className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full"
              >
                {level.school_level}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          {lowestPrice && (
            <p className="text-sm">
              {t("startingFrom")} <span className="font-semibold">{formatPrice(lowestPrice)}</span>
            </p>
          )}
          <Button 
            variant="secondary"
            onClick={() => navigate(`/profile/${teacher.user_id}`)}
          >
            {t("viewProfile")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};