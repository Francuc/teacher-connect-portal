import { TeacherCard } from "./TeacherCard";

interface TeachersGridProps {
  teachers: any[];
  isLoading: boolean;
  getLocalizedName: (item: any) => string;
  formatPrice: (price: number) => string;
}

export const TeachersGrid = ({
  teachers,
  isLoading,
  getLocalizedName,
  formatPrice,
}: TeachersGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[600px] bg-purple-soft/30 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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