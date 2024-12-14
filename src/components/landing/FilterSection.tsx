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
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useRef } from "react";

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
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleOpenChange = (open: boolean, triggerElement: HTMLButtonElement | null) => {
    if (open && triggerElement && isMobile) {
      // Wait for the next frame to ensure the dropdown is rendered
      requestAnimationFrame(() => {
        const yOffset = -20; // Adjust this value to control how far from the top
        const y = triggerElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      });
    }
  };

  const mobileSelectStyles = isMobile ? 
    "fixed inset-0 h-[100dvh] w-screen border-0 bg-white p-0 shadow-none animate-in fade-in-0 zoom-in-95 duration-200" : "";

  const mobileContentStyles = isMobile ?
    "grid grid-cols-2 gap-3 p-4 pb-8 overflow-y-auto max-h-[calc(100vh-60px)]" : 
    "grid grid-cols-2 md:grid-cols-3 gap-3";

  return (
    <div className="container mx-auto px-4 mb-12" ref={containerRef}>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        {/* Subject Filter */}
        <div className="relative">
          <Select
            value={selectedSubject}
            onValueChange={setSelectedSubject}
            onOpenChange={(open) => handleOpenChange(open, containerRef.current?.querySelector('[aria-expanded]') as HTMLButtonElement)}
          >
            <SelectTrigger 
              className="w-full h-14 text-lg bg-white shadow-lg hover:bg-gray-50 transition-colors border-2 border-purple.soft/30 focus:ring-2 focus:ring-primary/30 focus:border-primary rounded-xl pl-12"
            >
              <BookOpen className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/70" />
              <SelectValue placeholder={t("selectSubject")} />
            </SelectTrigger>
            <SelectContent 
              className={mobileSelectStyles}
              position={isMobile ? "popper" : "item-aligned"}
              side={isMobile ? "bottom" : "top"}
            >
              {isMobile && (
                <div className="sticky top-0 z-10 flex items-center justify-center h-[60px] border-b bg-white text-lg font-medium">
                  {t("selectSubject")}
                </div>
              )}
              <div className={mobileContentStyles}>
                <SelectItem 
                  value="all"
                  className="col-span-2 h-12 hover:bg-primary/10 rounded-lg data-[state=checked]:bg-primary/20 text-lg flex items-center justify-center"
                >
                  {t("allSubjects")}
                </SelectItem>
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
            </SelectContent>
          </Select>
        </div>

        {/* City Filter */}
        <div className="relative">
          <Select
            value={selectedCity}
            onValueChange={setSelectedCity}
            onOpenChange={(open) => handleOpenChange(open, containerRef.current?.querySelectorAll('[aria-expanded]')[1] as HTMLButtonElement)}
          >
            <SelectTrigger 
              className="w-full h-14 text-lg bg-white shadow-lg hover:bg-gray-50 transition-colors border-2 border-purple.soft/30 focus:ring-2 focus:ring-primary/30 focus:border-primary rounded-xl pl-12"
            >
              <MapPin className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/70" />
              <SelectValue placeholder={t("selectCity")} />
            </SelectTrigger>
            <SelectContent 
              className={mobileSelectStyles}
              position={isMobile ? "popper" : "item-aligned"}
              side={isMobile ? "bottom" : "top"}
            >
              {isMobile && (
                <div className="sticky top-0 z-10 flex items-center justify-center h-[60px] border-b bg-white text-lg font-medium">
                  {t("selectCity")}
                </div>
              )}
              <div className={mobileContentStyles}>
                <SelectItem 
                  value="all"
                  className="col-span-2 h-12 hover:bg-primary/10 rounded-lg data-[state=checked]:bg-primary/20 text-lg flex items-center justify-center"
                >
                  {t("allCities")}
                </SelectItem>
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
            </SelectContent>
          </Select>
        </div>

        {/* Online Toggle */}
        <div className="flex items-center justify-center h-14 px-4 bg-white shadow-lg rounded-xl border-2 border-purple.soft/30">
          <div className="flex items-center gap-2">
            <Switch
              id="online-mode"
              checked={showOnlineOnly}
              onCheckedChange={setShowOnlineOnly}
              className="data-[state=checked]:bg-primary"
            />
            <label htmlFor="online-mode" className="text-lg text-gray-700 flex items-center gap-2">
              {t("onlineOnly")}
              <Computer className="w-5 h-5 text-primary/70" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};