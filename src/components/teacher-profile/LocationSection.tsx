import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, DollarSign } from "lucide-react";
import { TEACHING_LOCATIONS, type TeachingLocation } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";

type LocationSectionProps = {
  formData: {
    location: string;
    teachingLocations: TeachingLocation[];
    pricePerHour: {
      teacherPlace: string;
      studentPlace: string;
      online: string;
    };
  };
  setFormData: (data: any) => void;
};

export const LocationSection = ({ formData, setFormData }: LocationSectionProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {t("location")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">{t("location")}</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="City, State"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>{t("teachingLocations")}</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEACHING_LOCATIONS.map((location) => (
              <div key={location} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={location}
                    checked={formData.teachingLocations.includes(location)}
                    onCheckedChange={(checked) => {
                      setFormData({
                        ...formData,
                        teachingLocations: checked
                          ? [...formData.teachingLocations, location]
                          : formData.teachingLocations.filter(
                              (l) => l !== location
                            ),
                      });
                    }}
                  />
                  <Label htmlFor={location}>{location}</Label>
                </div>
                {formData.teachingLocations.includes(location) && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <Input
                      type="number"
                      placeholder={t("pricePerHour")}
                      value={
                        formData.pricePerHour[
                          location.toLowerCase().replace("'s", "").split(" ")[0] as keyof typeof formData.pricePerHour
                        ]
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricePerHour: {
                            ...formData.pricePerHour,
                            [location
                              .toLowerCase()
                              .replace("'s", "")
                              .split(" ")[0]]: e.target.value,
                          },
                        })
                      }
                      className="w-32"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};