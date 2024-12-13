import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TeachersFilters } from "./teachers/TeachersFilters";
import { TeachersGrid } from "./teachers/TeachersGrid";
import { RandomTeachersButton } from "./teachers/RandomTeachersButton";
import { useTeachersData } from "@/hooks/useTeachersData";
import { useTeachersFilter } from "@/hooks/useTeachersFilter";
import { filterTeachers, getLocalizedName, getTeacherLocation, getLowestPrice, formatPrice } from "@/utils/teacherUtils";

interface TeachersListProps {
  initialSearchQuery?: string;
}

export const TeachersList = ({ initialSearchQuery = "" }: TeachersListProps) => {
  const { language } = useLanguage();
  const { data: teachers = [], isLoading: isLoadingTeachers } = useTeachersData();
  
  console.log('TeachersList - Current teachers data:', teachers);

  const {
    selectedSubject,
    setSelectedSubject,
    selectedLevel,
    setSelectedLevel,
    searchQuery,
    setSearchQuery,
  } = useTeachersFilter(initialSearchQuery);

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name_en');
      if (error) throw error;
      return data;
    }
  });

  const { data: schoolLevels = [] } = useQuery({
    queryKey: ['schoolLevels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_levels')
        .select('*')
        .order('name_en');
      if (error) throw error;
      return data;
    }
  });

  const { data: allCities = [] } = useQuery({
    queryKey: ['allCities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('*, region:regions(*)');
      if (error) throw error;
      return data;
    }
  });

  const getLocalizedNameWithLanguage = (item: any) => getLocalizedName(item, language);
  const getTeacherLocationWithLanguage = (teacher: any) => getTeacherLocation(teacher, language);

  const getCityTranslation = (cityName: string) => {
    const city = allCities.find(c => c.name_en === cityName);
    if (city) {
      return getLocalizedNameWithLanguage(city);
    }
    return cityName;
  };

  const filteredTeachers = filterTeachers(
    teachers,
    selectedSubject,
    selectedLevel,
    searchQuery,
    getLocalizedNameWithLanguage,
    getTeacherLocationWithLanguage,
    getCityTranslation
  );

  console.log('TeachersList - Filtered teachers:', filteredTeachers);

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
        getLocalizedName={getLocalizedNameWithLanguage}
      />

      <TeachersGrid
        teachers={filteredTeachers}
        isLoading={isLoadingTeachers}
        getLocalizedName={getLocalizedNameWithLanguage}
        formatPrice={formatPrice}
      />
    </div>
  );
};