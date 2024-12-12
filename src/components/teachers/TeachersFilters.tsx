import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, BookOpen, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState, useEffect, useRef } from "react";

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select(`
          *,
          region:regions(
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

  const getCityName = (city: any) => {
    const cityName = language === 'fr' ? city.name_fr : 
                    language === 'lb' ? city.name_lb : 
                    city.name_en;
    const regionName = language === 'fr' ? city.region.name_fr :
                      language === 'lb' ? city.region.name_lb :
                      city.region.name_en;
    return `${cityName}, ${regionName}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 0) {
      const filteredSuggestions = cities
        .map(getCityName)
        .filter(city => 
          city.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-purple.soft/30 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-purple.soft/30">
        <div className="p-6 space-y-2">
          <Label className="flex items-center gap-2 text-purple.dark">
            <Search className="w-4 h-4" />
            {t("search")}
          </Label>
          <div className="relative">
            <Input
              className="pl-4 border-purple.soft/30 focus:border-primary focus:ring-primary/30"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-1 bg-white border border-purple.soft/30 rounded-md shadow-lg"
                style={{ position: 'absolute', top: '100%' }}
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-purple.soft/10"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
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