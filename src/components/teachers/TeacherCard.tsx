import { Link } from "react-router-dom";
import { TeacherHeader } from "./card/TeacherHeader";
import { TeacherDetails } from "./card/TeacherDetails";
import { Card } from "../ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export const TeacherCard = ({ teacher }: { teacher: any }) => {
  const { language } = useLanguage();

  const getLocalizedName = (item: any) => {
    if (!item) return '';
    switch(language) {
      case 'fr':
        return item.name_fr;
      case 'lb':
        return item.name_lb;
      default:
        return item.name_en;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTeacherLocation = (teacher: any) => {
    if (!teacher.city || !teacher.city.region) return '';
    return `${getLocalizedName(teacher.city)}, ${getLocalizedName(teacher.city.region)}`;
  };

  return (
    <Link to={`/teachers/${teacher.user_id}`}>
      <Card className="h-full p-6 hover:shadow-lg transition-shadow">
        <TeacherHeader 
          teacher={teacher}
          getTeacherLocation={getTeacherLocation}
        />
        <TeacherDetails 
          teacher={teacher}
          getLocalizedName={getLocalizedName}
          formatPrice={formatPrice}
        />
      </Card>
    </Link>
  );
};