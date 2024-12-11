import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUBJECTS, SCHOOL_LEVELS } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock data for demonstration
const MOCK_TEACHERS = [
  {
    id: 1,
    name: "Sarah Miller",
    subjects: ["Mathematics", "Physics"],
    schoolLevels: ["Secondary"],
    location: "Luxembourg City",
  },
  {
    id: 2,
    name: "John Doe",
    subjects: ["English", "French"],
    schoolLevels: ["Primary", "Secondary"],
    location: "Esch-sur-Alzette",
  },
  // Add more mock teachers as needed
];

export const TeachersList = () => {
  const { t } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeachers = MOCK_TEACHERS.filter(teacher => {
    const matchesSubject = !selectedSubject || teacher.subjects.includes(selectedSubject);
    const matchesLevel = !selectedLevel || teacher.schoolLevels.includes(selectedLevel);
    const matchesSearch = !searchQuery || 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSubject && matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6">
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
              <SelectItem value="">{t("allSubjects")}</SelectItem>
              {SUBJECTS.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
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
              <SelectItem value="">{t("allLevels")}</SelectItem>
              {SCHOOL_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">{teacher.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{teacher.location}</p>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};