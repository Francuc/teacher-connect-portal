import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TeachersFilters } from "./teachers/TeachersFilters";
import { TeachersGrid } from "./teachers/TeachersGrid";
import { RandomTeachersButton } from "./teachers/RandomTeachersButton";
import { useTeachersData } from "@/hooks/useTeachersData";
import { useSubjectsData } from "@/hooks/useSubjectsData";
import { useSchoolLevelsData } from "@/hooks/useSchoolLevelsData";
import { getLocalizedName, getTeacherLocation, getLowestPrice, formatPrice } from "@/utils/teacherUtils";
import { useFilteredTeachers } from "@/hooks/useFilteredTeachers";

interface TeachersListProps {
  initialSearchQuery?: string;
}

export const TeachersList = ({ initialSearchQuery = "" }: TeachersListProps) => {
  const { language } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const { data: teachers = [], isLoading: isLoadingTeachers } = useTeachersData();
  const { data: subjects = [] } = useSubjectsData();
  const { data: schoolLevels = [] } = useSchoolLevelsData();

  const filteredTeachers = useFilteredTeachers(
    teachers,
    selectedSubject,
    selectedLevel,
    searchQuery,
    language
  );

  return (
    <div className="container mx-auto px-4 space-y-8">
      <RandomTeachersButton />
      <TeachersFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        subjects={subjects}
        schoolLevels={schoolLevels}
        getLocalizedName={(item) => getLocalizedName(item, language)}
      />

      <TeachersGrid
        teachers={filteredTeachers}
        isLoading={isLoadingTeachers}
        getLocalizedName={(item) => getLocalizedName(item, language)}
        getTeacherLocation={(teacher) => getTeacherLocation(teacher, language)}
        getLowestPrice={getLowestPrice}
        formatPrice={formatPrice}
      />
    </div>
  );
};