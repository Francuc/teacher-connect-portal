import { TeachingLocationCard } from "./location/TeachingLocationCard";
import { type TeachingLocation } from "@/lib/constants";

type LocationSectionProps = {
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

export const LocationSection = ({ formData, setFormData }: LocationSectionProps) => {
  return <TeachingLocationCard formData={formData} setFormData={setFormData} />;
};