import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/contexts/LanguageContext";
import { type Region } from "@/lib/constants";

type RegionSelectorProps = {
  regions: Region[];
  selectedRegionId: string;
  onRegionSelect: (value: string) => void;
  getLocalizedName: (item: any) => string;
};

export const RegionSelector = ({
  regions,
  selectedRegionId,
  onRegionSelect,
  getLocalizedName,
}: RegionSelectorProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label>{t("regions")}</Label>
      <RadioGroup
        value={selectedRegionId}
        onValueChange={onRegionSelect}
        className="grid grid-cols-2 gap-2"
      >
        {regions.map((region) => (
          <div key={region.id} className="flex items-center space-x-2">
            <RadioGroupItem value={region.id} id={`region-${region.id}`} />
            <Label htmlFor={`region-${region.id}`}>{getLocalizedName(region)}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};