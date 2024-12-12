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
        .select('*')
        .order('name_en');
      if (error) throw error;
      return data;
    },
  });

  const getCityName = (city: any) => {
    return language === 'fr' ? city.name_fr : 
           language === 'lb' ? city.name_lb : 
           city.name_en;
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
    <div className="bg-white rounded-2xl shadow-lg border border-purple.soft/30 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-purple.soft/30">
        <div className="p-8 space-y-3">
          <Label className="flex items-center gap-2 text-purple.dark font-medium">
            <Search className="w-5 h-5" />
            {t("search")}
          </Label>
          <div className="relative">
            <Input
              className="pl-4 h-12 border-purple.soft/30 focus:border-primary focus:ring-primary/30 text-lg"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute z-50 w-full bg-white border border-purple.soft/30 rounded-xl shadow-xl mt-2"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 cursor-pointer hover:bg-purple.soft/10 first:rounded-t-xl last:rounded-b-xl"
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
        
        <div className="p-8 space-y-3">
          <Label className="flex items-center gap-2 text-purple.dark font-medium">
            <BookOpen className="w-5 h-5" />
            {t("subjects")}
          </Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="h-12 border-purple.soft/30 focus:border-primary focus:ring-primary/30">
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

        <div className="p-8 space-y-3">
          <Label className="flex items-center gap-2 text-purple.dark font-medium">
            <GraduationCap className="w-5 h-5" />
            {t("schoolLevels")}
          </Label>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="h-12 border-purple.soft/30 focus:border-primary focus:ring-primary/30">
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