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

interface SearchFiltersProps {
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  showOnlineOnly: boolean;
  setShowOnlineOnly: (value: boolean) => void;
  subjects: any[];
  cities: any[];
  getLocalizedName: (item: any) => string;
}

export const SearchFilters = ({
  selectedSubject,
  setSelectedSubject,
  selectedCity,
  setSelectedCity,
  showOnlineOnly,
  setShowOnlineOnly,
  subjects,
  cities,
  getLocalizedName,
}: SearchFiltersProps) => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto relative">
        {/* Subject Filter */}
        <div className="relative">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger 
              className="w-full h-8 md:h-14 text-lg bg-white shadow-lg hover:bg-gray-50 transition-colors border-2 border-purple.soft/30 focus:ring-2 focus:ring-primary/30 focus:border-primary rounded-xl pl-12"
            >
              <BookOpen className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/70" />
              <SelectValue placeholder={t("selectSubject")} />
            </SelectTrigger>
            <SelectContent 
              className="bg-white max-h-[400px] w-[80vw] md:w-[600px]"
              align="center"
            >
              <div className="p-1 md:p-2">
                <SelectItem 
                  value="all"
                  className="mb-1 md:mb-2 h-8 md:h-12 hover:bg-primary/10 rounded-lg data-[state=checked]:bg-primary/20 text-lg"
                >
                  {t("allSubjects")}
                </SelectItem>
                <div className="grid grid-cols-3 gap-1 md:gap-2">
                  {subjects
                    .sort((a, b) => getLocalizedName(a).localeCompare(getLocalizedName(b)))
                    .map((subject) => (
                    <SelectItem 
                      key={subject.id} 
                      value={subject.id}
                      className="h-8 md:h-12 hover:bg-primary/10 rounded-lg data-[state=checked]:bg-primary/20 flex items-center justify-center text-center px-2"
                    >
                      {getLocalizedName(subject)}
                    </SelectItem>
                  ))}
                </div>
              </div>
            </SelectContent>
          </Select>
        </div>

        {/* City Filter */}
        <div className="relative">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger 
              className="w-full h-8 md:h-14 text-lg bg-white shadow-lg hover:bg-gray-50 transition-colors border-2 border-purple.soft/30 focus:ring-2 focus:ring-primary/30 focus:border-primary rounded-xl pl-12"
            >
              <MapPin className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/70" />
              <SelectValue placeholder={t("selectCity")} />
            </SelectTrigger>
            <SelectContent 
              className="bg-white max-h-[400px] w-[80vw] md:w-[600px]"
              align="center"
            >
              <div className="p-1 md:p-2">
                <SelectItem 
                  value="all"
                  className="mb-1 md:mb-2 h-8 md:h-12 hover:bg-primary/10 rounded-lg data-[state=checked]:bg-primary/20 text-lg"
                >
                  {t("allCities")}
                </SelectItem>
                <div className="grid grid-cols-3 gap-1 md:gap-2">
                  {cities
                    .sort((a, b) => getLocalizedName(a).localeCompare(getLocalizedName(b)))
                    .map((city) => (
                    <SelectItem 
                      key={city.id} 
                      value={city.id}
                      className="h-8 md:h-12 hover:bg-primary/10 rounded-lg data-[state=checked]:bg-primary/20 flex items-center justify-center text-center px-2"
                    >
                      {getLocalizedName(city)}
                    </SelectItem>
                  ))}
                </div>
              </div>
            </SelectContent>
          </Select>
        </div>

        {/* Online Toggle - Desktop version */}
        <div className="hidden md:flex md:absolute md:right-[-120px] md:top-0 items-center justify-center h-14 px-4 bg-white shadow-lg rounded-xl border-2 border-purple.soft/30">
          <Switch
            id="online-mode"
            checked={showOnlineOnly}
            onCheckedChange={setShowOnlineOnly}
            className="data-[state=checked]:bg-primary"
          />
          <Computer className="w-5 h-5 ml-2 text-primary/70" />
        </div>

        {/* Online Toggle - Mobile version */}
        <div className="md:hidden col-span-1 flex items-center justify-center h-8 px-4 bg-white shadow-lg rounded-xl border-2 border-purple.soft/30">
          <span className="text-primary/70 mr-2">{t("onlineOnly")}</span>
          <Switch
            id="online-mode-mobile"
            checked={showOnlineOnly}
            onCheckedChange={setShowOnlineOnly}
            className="data-[state=checked]:bg-primary"
          />
          <Computer className="w-5 h-5 ml-2 text-primary/70" />
        </div>
      </div>
    </div>
  );
};