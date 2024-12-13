import { TeacherCard } from "./TeacherCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface TeachersGridProps {
  teachers: any[];
}

export const TeachersGrid = ({ teachers }: TeachersGridProps) => {
  const { t, currentLanguage } = useLanguage();

  const getLocalizedName = (item: any) => {
    return item?.[`name_${currentLanguage}`] || item?.name_en;
  };

  const formatPrice = (price: number) => {
    return `${price}€/h`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teachers?.map((teacher) => (
        <TeacherCard
          key={teacher.id}
          teacher={teacher}
          getLocalizedName={getLocalizedName}
          formatPrice={formatPrice}
        />
      ))}
    </div>
  );
};