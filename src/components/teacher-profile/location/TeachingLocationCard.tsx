import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin } from "lucide-react";
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
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {t("teachingLocations")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TeachingLocationsList formData={formData} setFormData={setFormData} />
      </CardContent>
    </Card>
  );
};