import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeacherLocations } from "./card/TeacherLocations";
import { TeacherAvailableCities } from "./card/TeacherAvailableCities";
import { TeacherContactInfo } from "./card/TeacherContactInfo";
import { Section } from "./card/Section";

export const TeacherCard2 = ({ teacher }: { teacher: any }) => {
  const { language } = useLanguage();
  const prefix = language === 'fr' ? 'cours-de-rattrapage' : language === 'lb' ? 'nohellef' : 'tutoring';
  const teacherName = `${teacher.first_name}-${teacher.last_name}`.toLowerCase().replace(/\s+/g, '-');
  // Default to 'general' if no subjects are selected yet
  const url = `/${prefix}/general/${teacherName}`;

  return (
    <Link to={url} className="block">
      <Card className="h-full hover:shadow-lg transition-shadow duration-200">
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={teacher.profile_picture_url} />
              <AvatarFallback>{`${teacher.first_name[0]}${teacher.last_name[0]}`}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{`${teacher.first_name} ${teacher.last_name}`}</h3>
            </div>
          </div>

          <TeacherLocations teacher={teacher} />
          <TeacherAvailableCities teacher={teacher} />
          <TeacherContactInfo teacher={teacher} />
        </div>
      </Card>
    </Link>
  );
};