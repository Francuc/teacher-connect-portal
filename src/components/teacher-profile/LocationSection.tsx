import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, DollarSign } from "lucide-react";
import { TEACHING_LOCATIONS, type TeachingLocation } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock data for regions and cities - replace with actual data later
const REGIONS = ["North", "South", "East", "West", "Center"];
const CITIES_BY_REGION: Record<string, string[]> = {
  North: ["City1", "City2", "City3"],
  South: ["City4", "City5", "City6"],
  East: ["City7", "City8", "City9"],
  West: ["City10", "City11", "City12"],
  Center: ["City13", "City14", "City15"],
};

type LocationSectionProps = {
  formData: {
    teachingLocations: TeachingLocation[];
    teacherCity: string;
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
  const { t } = useLanguage();

  const handleRegionChange = (region: string, checked: boolean) => {
    const newRegions = checked
      ? [...formData.studentRegions, region]
      : formData.studentRegions.filter((r) => r !== region);
    
    // When a region is selected, add all its cities by default
    const newCities = [...formData.studentCities];
    if (checked) {
      CITIES_BY_REGION[region].forEach((city) => {
        if (!newCities.includes(city)) {
          newCities.push(city);
        }
      });
    } else {
      // Remove cities from this region when region is unselected
      CITIES_BY_REGION[region].forEach((city) => {
        const index = newCities.indexOf(city);
        if (index > -1) {
          newCities.splice(index, 1);
        }
      });
    }

    setFormData({
      ...formData,
      studentRegions: newRegions,
      studentCities: newCities,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {t("teachingLocations")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
                <div className="space-y-2 pl-6">
                  {location === "Teacher's Place" && (
                    <div className="space-y-2">
                      <Label htmlFor="teacherCity">{t("city")}</Label>
                      <Input
                        id="teacherCity"
                        value={formData.teacherCity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            teacherCity: e.target.value,
                          })
                        }
                        placeholder={t("enterCity")}
                      />
                    </div>
                  )}

                  {location === "Student's Place" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t("regions")}</Label>
                        {REGIONS.map((region) => (
                          <div key={region} className="flex items-center space-x-2">
                            <Checkbox
                              id={`region-${region}`}
                              checked={formData.studentRegions.includes(region)}
                              onCheckedChange={(checked) =>
                                handleRegionChange(region, checked as boolean)
                              }
                            />
                            <Label htmlFor={`region-${region}`}>{region}</Label>
                          </div>
                        ))}
                      </div>

                      {formData.studentRegions.length > 0 && (
                        <div className="space-y-2">
                          <Label>{t("cities")}</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {formData.studentRegions.map((region) =>
                              CITIES_BY_REGION[region].map((city) => (
                                <div key={city} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`city-${city}`}
                                    checked={formData.studentCities.includes(city)}
                                    onCheckedChange={(checked) =>
                                      setFormData({
                                        ...formData,
                                        studentCities: checked
                                          ? [...formData.studentCities, city]
                                          : formData.studentCities.filter(
                                              (c) => c !== city
                                            ),
                                      })
                                    }
                                  />
                                  <Label htmlFor={`city-${city}`}>{city}</Label>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

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
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};