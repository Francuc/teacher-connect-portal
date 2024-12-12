import { RegionSelector } from "../RegionSelector";
import { CitySelector } from "../CitySelector";
import { LocationDisplay } from "../LocationDisplay";

type TeacherPlaceSectionProps = {
  selectedRegionId: string;
  selectedCityId: string;
  cities: any[];
  regions: any[];
  onRegionSelect: (value: string) => void;
  onCitySelect: (value: string) => void;
  getLocalizedName: (item: any) => string;
};

export const TeacherPlaceSection = ({
  selectedRegionId,
  selectedCityId,
  cities,
  regions,
  onRegionSelect,
  onCitySelect,
  getLocalizedName,
}: TeacherPlaceSectionProps) => {
  const selectedCity = cities.find(city => city.id === selectedCityId);

  return (
    <div className="space-y-4">
      <RegionSelector
        regions={regions}
        selectedRegionId={selectedRegionId}
        onRegionSelect={onRegionSelect}
        getLocalizedName={getLocalizedName}
      />

      {selectedRegionId && (
        <CitySelector
          cities={cities}
          selectedRegionId={selectedRegionId}
          selectedCityId={selectedCityId}
          onCitySelect={onCitySelect}
          getLocalizedName={getLocalizedName}
        />
      )}

      <LocationDisplay
        selectedCity={selectedCity}
        getLocalizedName={getLocalizedName}
      />
    </div>
  );
};