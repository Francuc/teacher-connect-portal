import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, User, GraduationCap, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    setImageError(false);
  }, [teacher]);

  const teacherPlace = teacher.teacher_locations?.find(
    (loc: any) => loc.location_type === "Teacher's Place"
  );
  
  const studentPlace = teacher.teacher_locations?.find(
    (loc: any) => loc.location_type === "Student's Place"
  );

  const profilePictureUrl = teacher.profile_picture_url 
    ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile-pictures/${teacher.profile_picture_url}`
    : null;

  console.log('Teacher data:', {
    subjects: teacher.teacher_subjects,
    levels: teacher.teacher_school_levels,
    locations: teacher.teacher_locations,
    studentCities: teacher.teacher_student_cities
  });

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      <div className="p-6 flex flex-col h-full space-y-6">
        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 rounded-full border-4 border-purple-soft">
            {profilePictureUrl && !imageError ? (
              <AvatarImage 
                src={profilePictureUrl}
                alt={`${teacher.first_name} ${teacher.last_name}`}
                className="object-cover"
                onError={() => {
                  console.log('Image failed to load:', profilePictureUrl);
                  setImageError(true);
                }}
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
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4" />
                {getTeacherLocation(teacher)}
              </p>
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
              {teacher.teacher_subjects.map((subjectData: any, index: number) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
                >
                  {getLocalizedName(subjectData.subject)}
                </span>
              ))}
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
              {teacher.teacher_school_levels.map((level: any, index: number) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium"
                >
                  {level.school_level}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Teaching Locations Section */}
        {teacher.teacher_locations && teacher.teacher_locations.length > 0 && (
          <div className="space-y-4">
            {/* Teacher's Place */}
            {teacherPlace && teacher.city && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{t("teacherPlace")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-dark">
                    {getTeacherLocation(teacher)}
                  </span>
                  <span className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
                    {formatPrice(teacherPlace.price_per_hour)}/h
                  </span>
                </div>
              </div>
            )}

            {/* Student's Place */}
            {studentPlace && teacher.teacher_student_cities && teacher.teacher_student_cities.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{t("studentPlace")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    {teacher.teacher_student_cities.map((cityData: any, index: number) => (
                      <span
                        key={index}
                        className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium"
                      >
                        {cityData.city_name}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full ml-2">
                    {formatPrice(studentPlace.price_per_hour)}/h
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer with Action Button */}
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