import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen } from "lucide-react";
import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeachersFilterRowProps {
  onCityChange: (cityId: string) => void;
  onSubjectChange: (subjectId: string) => void;
}

export const TeachersFilterRow = ({ onCityChange, onSubjectChange }: TeachersFilterRowProps) => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

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

  return (
    <div className="w-full bg-white border border-purple-soft/30 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-purple-dark flex items-center gap-2">
            <Search className="w-4 h-4" />
            {t("city")}
          </label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between border-purple-soft/30 focus:border-primary focus:ring-primary/20"
              >
                {value
                  ? cities.find((city) => getLocalizedName(city) === value)
                    ? getLocalizedName(cities.find((city) => getLocalizedName(city) === value))
                    : value
                  : t("searchCity")}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder={t("searchCity")} />
                <CommandEmpty>{t("noCityFound")}</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {cities.map((city) => (
                    <CommandItem
                      key={city.id}
                      value={getLocalizedName(city)}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        onCityChange(currentValue === value ? "" : getLocalizedName(city));
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === getLocalizedName(city) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {getLocalizedName(city)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-purple-dark flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {t("subjects")}
          </label>
          <Select onValueChange={onSubjectChange}>
            <SelectTrigger className="w-full border-purple-soft/30">
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