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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="h-[400px] rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No teachers found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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