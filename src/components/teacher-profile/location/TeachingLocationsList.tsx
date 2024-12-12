import { TEACHING_LOCATIONS } from "@/lib/constants";
import { TeachingLocationItem } from "./TeachingLocationItem";
import { type TeachingLocation } from "@/lib/constants";

type TeachingLocationsListProps = {
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

export const TeachingLocationsList = ({ formData, setFormData }: TeachingLocationsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {TEACHING_LOCATIONS.map((location) => (
        <TeachingLocationItem
          key={location}
          location={location}
          formData={formData}
          setFormData={setFormData}
        />
      ))}
    </div>
  );
};