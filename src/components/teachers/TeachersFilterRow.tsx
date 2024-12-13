import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Search, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeachersFilterRowProps {
  onCityChange: (cityId: string) => void;
  onSubjectChange: (subjectId: string) => void;
}

export const TeachersFilterRow = ({ onCityChange, onSubjectChange }: TeachersFilterRowProps) => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");

  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select(`
          *,
          region:regions(*)
        `)
        .order('name_en');
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name_en');
      
      if (error) throw error;
      return data || [];
    },
  });

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

  const getCityWithRegion = (city: any) => {
    if (!city || !city.region) return '';
    const cityName = getLocalizedName(city);
    const regionName = getLocalizedName(city.region);
    return `${cityName}, ${regionName}`;
  };

  const handleCitySelect = (cityId: string) => {
    setSelectedCity(cityId);
    onCityChange(cityId);
    setOpen(false);
  };

  const matchesSearch = (city: any, searchValue: string) => {
    const searchLower = searchValue.toLowerCase();
    return (
      city.name_en.toLowerCase().includes(searchLower) ||
      city.name_fr.toLowerCase().includes(searchLower) ||
      city.name_lb.toLowerCase().includes(searchLower)
    );
  };

  return (
    <div className="w-full bg-white border border-purple.soft/30 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-purple.dark flex items-center gap-2">
            <Search className="w-4 h-4" />
            {t("searchByCity")}
          </label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between border-purple.soft/30 hover:bg-purple.soft/5"
              >
                {selectedCity ? (
                  getCityWithRegion(cities.find((city) => city.id === selectedCity))
                ) : (
                  t("selectCity")
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder={t("searchCity")} />
                <CommandEmpty>{t("noCityFound")}</CommandEmpty>
                <CommandGroup>
                  {cities.map((city) => (
                    <CommandItem
                      key={city.id}
                      value={getCityWithRegion(city)}
                      onSelect={() => handleCitySelect(city.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCity === city.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {getCityWithRegion(city)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-purple.dark flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {t("filterBySubject")}
          </label>
          <Select onValueChange={onSubjectChange}>
            <SelectTrigger className="w-full border-purple.soft/30">
              <SelectValue placeholder={t("allSubjects")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allSubjects")}</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {getLocalizedName(subject)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};