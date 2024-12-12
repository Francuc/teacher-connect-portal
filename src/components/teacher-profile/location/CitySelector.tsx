import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/contexts/LanguageContext";
import { type City } from "@/lib/constants";

type CitySelectorProps = {
  cities: City[];
  selectedRegionId: string;
  selectedCityId: string;
  onCitySelect: (value: string) => void;
  getLocalizedName: (item: any) => string;
};

export const CitySelector = ({
  cities,
  selectedRegionId,
  selectedCityId,
  onCitySelect,
  getLocalizedName,
}: CitySelectorProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label>{t("cities")}</Label>
      <RadioGroup
        value={selectedCityId}
        onValueChange={onCitySelect}
        className="grid grid-cols-2 gap-2"
      >
        {cities
          .filter(city => city.region_id === selectedRegionId)
          .map((city) => (
            <div key={city.id} className="flex items-center space-x-2">
              <RadioGroupItem value={city.id} id={`city-${city.id}`} />
              <Label htmlFor={`city-${city.id}`}>{getLocalizedName(city)}</Label>
            </div>
          ))}
      </RadioGroup>
    </div>
  );
};