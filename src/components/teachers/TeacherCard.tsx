import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { TeacherSubjects } from "./card/TeacherSubjects";
import { TeacherLevels } from "./card/TeacherLevels";
import { TeacherLocations } from "./card/TeacherLocations";

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

  console.log("Teacher data in card:", teacher);

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
                <span>{formatPrice(lowestPrice)}/h</span>
              </div>
            )}
          </div>
        </div>

        {/* Subjects Section */}
        {teacher.teacher_subjects && teacher.teacher_subjects.length > 0 && (
          <TeacherSubjects 
            subjects={teacher.teacher_subjects}
            getLocalizedName={getLocalizedName}
          />
        )}

        {/* School Levels Section */}
        {teacher.teacher_school_levels && teacher.teacher_school_levels.length > 0 && (
          <TeacherLevels levels={teacher.teacher_school_levels} />
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
            <TeacherLocations 
              teacher={teacher}
              getLocalizedName={getLocalizedName}
            />
          )}
        </div>

        {/* Footer with Action Button */}
        <div className="mt-auto pt-4 border-t flex justify-between items-center">
          {lowestPrice && (
            <div className="text-lg font-semibold text-green-600">
              {t("priceStartingAt")} {formatPrice(lowestPrice)}/h
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