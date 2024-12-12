import { TeacherPlaceSection } from "./TeacherPlaceSection";
import { RegionsSection } from "../RegionsSection";
import { PriceInput } from "../PriceInput";
import { type TeachingLocation } from "@/lib/constants";

type LocationContentProps = {
  location: TeachingLocation;
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
  selectedRegionId: string;
  onRegionSelect: (value: string) => void;
  cities: any[];
  regions: any[];
  getLocalizedName: (item: any) => string;
  currentPrice: string;
  onPriceChange: (value: string) => void;
};

export const LocationContent = ({
  location,
  formData,
  setFormData,
  selectedRegionId,
  onRegionSelect,
  cities,
  regions,
  getLocalizedName,
  currentPrice,
  onPriceChange,
}: LocationContentProps) => {
  return (
    <div className="space-y-2 pl-6">
      {location === "Teacher's Place" && (
        <TeacherPlaceSection
          selectedRegionId={selectedRegionId}
          selectedCityId={formData.cityId}
          cities={cities}
          regions={regions}
          onRegionSelect={onRegionSelect}
          onCitySelect={(value) => setFormData({ ...formData, cityId: value })}
          getLocalizedName={getLocalizedName}
        />
      )}

      {location === "Student's Place" && (
        <RegionsSection formData={formData} setFormData={setFormData} />
      )}

      <PriceInput
        value={currentPrice}
        onChange={onPriceChange}
      />
    </div>
  );
};