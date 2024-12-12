import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { TeachingLocationsList } from "./TeachingLocationsList";
import { type TeachingLocation } from "@/lib/constants";
import { CityAutocomplete } from "../CityAutocomplete";

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
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("yourCity")}</label>
            <CityAutocomplete
              value={formData.cityId}
              onChange={(value) => setFormData({ ...formData, cityId: value })}
            />
          </div>
          <TeachingLocationsList formData={formData} setFormData={setFormData} />
        </div>
      </CardContent>
    </Card>
  );
};