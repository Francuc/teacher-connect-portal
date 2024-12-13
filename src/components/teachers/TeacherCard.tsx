import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Euro, MapPin, User, GraduationCap, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  console.log('Teacher data in card:', teacher);

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
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4" />
              {getTeacherLocation(teacher)}
            </p>
          </div>
        </div>

        {/* Accordion for Details */}
        <Accordion type="single" collapsible className="w-full">
          {/* Subjects Section */}
          <AccordionItem value="subjects">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{t("subjects")}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pt-2">
                {teacher.teacher_subjects?.map((subjectData: any) => (
                  <span
                    key={subjectData.subject.id}
                    className="px-3 py-1 bg-purple-soft text-purple-vivid rounded-full text-sm font-medium"
                  >
                    {getLocalizedName(subjectData.subject)}
                  </span>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* School Levels Section */}
          <AccordionItem value="levels">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>{t("schoolLevels")}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pt-2">
                {teacher.teacher_school_levels?.map((level: any, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                  >
                    {level.school_level}
                  </span>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Teaching Locations Section */}
          <AccordionItem value="locations">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{t("teachingLocations")}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {teacher.teacher_locations?.map((location: any) => (
                  <div 
                    key={location.id} 
                    className="flex justify-between items-center text-sm p-2 bg-accent/5 rounded-lg"
                  >
                    <span>{location.location_type}</span>
                    <span className="font-medium flex items-center gap-1">
                      <Euro className="w-4 h-4" />
                      {formatPrice(location.price_per_hour)}
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
            className="bg-purple-vivid hover:bg-purple-vivid/90 text-white"
          >
            {t("viewProfile")}
          </Button>
        </div>
      </div>
    </Card>
  );
};