import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { type TeachingLocation } from "@/lib/constants";

type LocationCheckboxProps = {
  location: TeachingLocation;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
};

export const LocationCheckbox = ({ location, isChecked, onChange }: LocationCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={location}
        checked={isChecked}
        onCheckedChange={(checked) => onChange(checked as boolean)}
      />
      <Label htmlFor={location}>{location}</Label>
    </div>
  );
};