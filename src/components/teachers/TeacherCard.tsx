import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Euro, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

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
      <div className="p-6 flex flex-col h-full">
        {/* Header with Profile Picture and Basic Info */}
        <div className="flex items-start gap-4 mb-6">
          <Avatar className="w-24 h-24 rounded-xl">
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
          <div>
            <h3 className="text-xl font-semibold mb-2">
              {teacher.first_name} {teacher.last_name}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {getTeacherLocation(teacher)}
            </p>
          </div>
        </div>

        {/* Subjects Section */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">{t("subjects")}</h4>
          <div className="flex flex-wrap gap-2">
            {teacher.teacher_subjects?.map((subjectData: any) => (
              <span
                key={subjectData.subject_id}
                className="px-3 py-1 bg-purple-soft text-purple-vivid rounded-full text-sm"
              >
                {getLocalizedName(subjectData.subject)}
              </span>
            ))}
          </div>
        </div>

        {/* School Levels Section */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">{t("schoolLevels")}</h4>
          <div className="flex flex-wrap gap-2">
            {teacher.teacher_school_levels?.map((level: any, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
              >
                {level.school_level}
              </span>
            ))}
          </div>
        </div>

        {/* Teaching Locations and Prices */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">{t("teachingLocations")}</h4>
          <div className="space-y-2">
            {teacher.teacher_locations?.map((location: any) => (
              <div 
                key={location.id} 
                className="flex justify-between items-center text-sm"
              >
                <span>{location.location_type}</span>
                <span className="font-medium flex items-center gap-1">
                  <Euro className="w-4 h-4" />
                  {formatPrice(location.price_per_hour)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Price and Action Button */}
        <div className="mt-auto pt-4 border-t flex items-center justify-between">
          {lowestPrice && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Euro className="w-4 h-4" />
              <span>
                {t("startingFrom")} 
                <span className="font-semibold text-purple-dark ml-1">
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