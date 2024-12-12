import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { type City } from "@/lib/constants";

type LocationDisplayProps = {
  selectedCity: City | undefined;
  getLocalizedName: (item: any) => string;
};

export const LocationDisplay = ({ selectedCity, getLocalizedName }: LocationDisplayProps) => {
  const { t } = useLanguage();

  if (!selectedCity) return null;

  return (
    <div className="mt-4">
      <Label>{t("selectedLocation")}</Label>
      <Textarea 
        value={`${getLocalizedName(selectedCity)}, ${getLocalizedName(selectedCity.region)}`}
        readOnly
        className="mt-2 bg-muted"
      />
    </div>
  );
};