import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { type TeachingLocation } from "@/lib/constants";
import { LocationCheckbox } from "./components/LocationCheckbox";
import { LocationContent } from "./components/LocationContent";
import { LocationSummary } from "./LocationSummary";
import { useLocationData } from "./hooks/useLocationData";

type TeachingLocationItemProps = {
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
};

export const TeachingLocationItem = ({
  location,
  formData,
  setFormData,
}: TeachingLocationItemProps) => {
  const { language } = useLanguage();
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const { regions, cities } = useLocationData();

  const getLocalizedName = (item: any) => {
    if (!item) return '';
    switch(language) {
      case 'fr':
        return item.name_fr;
      case 'lb':
        return item.name_lb;
      default:
        return item.name_en;
    }
  };

  const getLocationKey = (location: TeachingLocation): keyof typeof formData.pricePerHour => {
    switch (location) {
      case "Teacher's Place":
        return "teacherPlace";
      case "Student's Place":
        return "studentPlace";
      case "Online":
        return "online";
      default:
        return "online";
    }
  };

  const handlePriceChange = (value: string) => {
    setFormData({
      ...formData,
      pricePerHour: {
        ...formData.pricePerHour,
        [getLocationKey(location)]: value,
      },
    });
  };

  const handleLocationChange = (checked: boolean) => {
    setFormData({
      ...formData,
      teachingLocations: checked
        ? [...formData.teachingLocations, location]
        : formData.teachingLocations.filter((l) => l !== location),
    });
    if (checked) {
      setIsEditing(true);
    }
  };

  const locationKey = getLocationKey(location);
  const currentPrice = formData.pricePerHour[locationKey];
  const formattedPrice = currentPrice ? `${currentPrice}€/h` : '';
  const selectedCity = cities.find(city => city.id === formData.cityId);

  if (!isEditing && formData.teachingLocations.includes(location)) {
    return (
      <LocationSummary
        location={location}
        price={formattedPrice}
        selectedCity={selectedCity}
        studentRegions={formData.studentRegions}
        studentCities={formData.studentCities}
        getLocalizedName={getLocalizedName}
        onEdit={() => setIsEditing(true)}
      />
    );
  }

  return (
    <div className="space-y-2">
      <LocationCheckbox
        location={location}
        isChecked={formData.teachingLocations.includes(location)}
        onChange={handleLocationChange}
      />

      {formData.teachingLocations.includes(location) && (
        <LocationContent
          location={location}
          formData={formData}
          setFormData={setFormData}
          selectedRegionId={selectedRegionId}
          onRegionSelect={setSelectedRegionId}
          cities={cities}
          regions={regions}
          getLocalizedName={getLocalizedName}
          currentPrice={currentPrice}
          onPriceChange={handlePriceChange}
        />
      )}
    </div>
  );
};