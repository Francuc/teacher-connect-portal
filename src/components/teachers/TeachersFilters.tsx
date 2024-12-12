import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, BookOpen, GraduationCap } from "lucide-react";

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
  const { t } = useLanguage();

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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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