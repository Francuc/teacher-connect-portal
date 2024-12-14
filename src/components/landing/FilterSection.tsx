import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, MapPin, Computer } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface FilterSectionProps {
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  showOnlineOnly: boolean;
  setShowOnlineOnly: (value: boolean) => void;
  subjects: any[];
  cities: any[];
}

export const FilterSection = ({
  selectedSubject,
  setSelectedSubject,
  selectedCity,
  setSelectedCity,
  showOnlineOnly,
  setShowOnlineOnly,
  subjects,
  cities
}: FilterSectionProps) => {
  const { t, language } = useLanguage();

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

  return (
    <div className="container mx-auto px-4 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Subject Filter */}
        <div className="relative">
          <Select
            value={selectedSubject}
            onValueChange={setSelectedSubject}
          >
            <SelectTrigger 
              className="w-full h-14 text-lg bg-white shadow-lg hover:bg-gray-50 transition-colors border-2 border-purple.soft/30 focus:ring-2 focus:ring-primary/30 focus:border-primary rounded-xl pl-12"
            >
              <BookOpen className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/70" />
              <SelectValue placeholder={t("selectSubject")} />
            </SelectTrigger>
            <SelectContent 
              className="bg-white w-[100vw] fixed left-0 top-0 h-[100vh] border-0 rounded-none md:w-auto md:h-auto md:relative md:border md:rounded-lg"
              position="popper"
              align="start"
              sideOffset={0}
            >
              <div className="p-4 overflow-y-auto max-h-[80vh] md:max-h-[400px]">
                <SelectItem 
                  value="all"
                  className="mb-4 h-12 hover:bg-primary/10 rounded-lg data-[state=checked]:bg-primary/20 text-lg"
                >
                  {t("allSubjects")}
                </SelectItem>
                <div className="grid grid-cols-3 gap-3">
                  {subjects
                    .sort((a, b) => getLocalizedName(a).localeCompare(getLocalizedName(b)))
                    .map((subject) => (
                    <SelectItem 
                      key={subject.id} 
                      value={subject.id}
                      className="h-12 hover:bg-primary/10 rounded-lg data-[state=checked]:bg-primary/20 flex items-center justify-center text-center px-2"
                    >
                      {getLocalizedName(subject)}
                    </SelectItem>
                  ))}
                </div>
              </div>
            </SelectContent>
          </Select>
        </div>

        {/* City Filter with Online Switch */}
        <div className="relative flex gap-2 items-center">
          <div className="flex-1">
            <Select
              value={selectedCity}
              onValueChange={setSelectedCity}
            >
              <SelectTrigger 
                className="w-full h-14 text-lg bg-white shadow-lg hover:bg-gray-50 transition-colors border-2 border-purple.soft/30 focus:ring-2 focus:ring-primary/30 focus:border-primary rounded-xl pl-12"
              >
                <MapPin className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/70" />
                <SelectValue placeholder={t("selectCity")} />
              </SelectTrigger>
              <SelectContent 
                className="bg-white w-[100vw] fixed left-0 top-0 h-[100vh] border-0 rounded-none md:w-auto md:h-auto md:relative md:border md:rounded-lg"
                position="popper"
                align="start"
                sideOffset={0}
              >
                <div className="p-4 overflow-y-auto max-h-[80vh] md:max-h-[400px]">
                  <SelectItem 
                    value="all"
                    className="mb-4 h-12 hover:bg-primary/10 rounded-lg data-[state=checked]:bg-primary/20 text-lg"
                  >
                    {t("allCities")}
                  </SelectItem>
                  <div className="grid grid-cols-3 gap-3">
                    {cities
                      .sort((a, b) => getLocalizedName(a).localeCompare(getLocalizedName(b)))
                      .map((city) => (
                      <SelectItem 
                        key={city.id} 
                        value={city.id}
                        className="h-12 hover:bg-primary/10 rounded-lg data-[state=checked]:bg-primary/20 flex items-center justify-center text-center px-2"
                      >
                        {getLocalizedName(city)}
                      </SelectItem>
                    ))}
                  </div>
                </div>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-center h-14 px-4 bg-white shadow-lg rounded-xl border-2 border-purple.soft/30">
            <Switch
              id="online-mode"
              checked={showOnlineOnly}
              onCheckedChange={setShowOnlineOnly}
              className="data-[state=checked]:bg-primary"
            />
            <Computer className="w-5 h-5 ml-2 text-primary/70" />
          </div>
        </div>
      </div>
    </div>
  );
};