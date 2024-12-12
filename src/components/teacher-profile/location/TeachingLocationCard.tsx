import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { TeachingLocationsList } from "./TeachingLocationsList";
import { type TeachingLocation } from "@/lib/constants";

type TeachingLocationCardProps = {
  formData: {
    teachingLocations: TeachingLocation[];
    cityId: string;
    studentRegions: string[];
    studentCities: string[];
    pricePerHour: {
      teacherPlace: string;
      studentPlace: string;
      online: string;
    };
  };
  setFormData: (data: any) => void;
};

export const TeachingLocationCard = ({ formData, setFormData }: TeachingLocationCardProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("teachingLocations")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TeachingLocationsList formData={formData} setFormData={setFormData} />
      </CardContent>
    </Card>
  );
};