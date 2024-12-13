import { TeacherCard } from "./TeacherCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface TeachersGridProps {
  teachers: any[];
  isLoading?: boolean;
}

export const TeachersGrid = ({ teachers, isLoading = false }: TeachersGridProps) => {
  const { t, language } = useLanguage();

  const getLocalizedName = (item: any) => {
    return item?.[`name_${language}`] || item?.name_en;
  };

  const formatPrice = (price: number) => {
    return `${price}€/h`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="h-[400px] rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!teachers?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">{t("noResults")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teachers.map((teacher) => (
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