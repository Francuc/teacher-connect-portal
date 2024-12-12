import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, BookOpen, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeachersFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
  selectedLevel: string;
  setSelectedLevel: (value: string) => void;
  subjects: any[];
  schoolLevels: any[];
  getLocalizedName: (item: any) => string;
}

export const TeachersFilters = ({
  searchQuery,
  setSearchQuery,
  selectedSubject,
  setSelectedSubject,
  selectedLevel,
  setSelectedLevel,
  subjects,
  schoolLevels,
  getLocalizedName,
}: TeachersFiltersProps) => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);

  const { data: cities = [], isLoading: isCitiesLoading } = useQuery({
    queryKey: ['cities', searchQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select(`
          *,
          region:regions(
            id,
            name_en,
            name_fr,
            name_lb
          )
        `)
        .order('name_en');
      
      if (error) throw error;
      return data || [];
    },
  });

  const getLocalizedCityName = (city: any) => {
    if (!city) return '';
    const cityName = language === 'fr' ? city.name_fr : language === 'lb' ? city.name_lb : city.name_en;
    const regionName = language === 'fr' ? city.region.name_fr : language === 'lb' ? city.region.name_lb : city.region.name_en;
    return `${cityName}, ${regionName}`;
  };

  const filteredCities = searchQuery
    ? cities.filter((city) =>
        getLocalizedCityName(city)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : cities;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-purple.soft/30 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-purple.soft/30">
        <div className="p-6 space-y-2">
          <Label className="flex items-center gap-2 text-purple.dark">
            <Search className="w-4 h-4" />
            {t("search")}
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {searchQuery
                  ? cities.find((city) => getLocalizedCityName(city).toLowerCase() === searchQuery.toLowerCase())
                    ? getLocalizedCityName(cities.find((city) => getLocalizedCityName(city).toLowerCase() === searchQuery.toLowerCase())!)
                    : searchQuery
                  : t("searchPlaceholder")}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder={t("searchPlaceholder")} onValueChange={setSearchQuery} />
                <CommandEmpty>{t("noCityFound")}</CommandEmpty>
                <CommandGroup>
                  {filteredCities.map((city) => (
                    <CommandItem
                      key={city.id}
                      value={getLocalizedCityName(city)}
                      onSelect={(currentValue) => {
                        setSearchQuery(currentValue === searchQuery ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          searchQuery.toLowerCase() === getLocalizedCityName(city).toLowerCase() ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {getLocalizedCityName(city)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="p-6 space-y-2">
          <Label className="flex items-center gap-2 text-purple.dark">
            <BookOpen className="w-4 h-4" />
            {t("subjects")}
          </Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="border-purple.soft/30 focus:border-primary focus:ring-primary/30">
              <SelectValue placeholder={t("allSubjects")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allSubjects")}</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={getLocalizedName(subject)}>
                  {getLocalizedName(subject)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-6 space-y-2">
          <Label className="flex items-center gap-2 text-purple.dark">
            <GraduationCap className="w-4 h-4" />
            {t("schoolLevels")}
          </Label>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="border-purple.soft/30 focus:border-primary focus:ring-primary/30">
              <SelectValue placeholder={t("allLevels")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allLevels")}</SelectItem>
              {schoolLevels.map((level) => (
                <SelectItem key={level.id} value={getLocalizedName(level)}>
                  {getLocalizedName(level)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};