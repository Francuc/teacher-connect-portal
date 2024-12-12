import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="search">{t("search")}</Label>
        <Input
          id="search"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>{t("subjects")}</Label>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger>
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

      <div className="space-y-2">
        <Label>{t("schoolLevels")}</Label>
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger>
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
  );
};