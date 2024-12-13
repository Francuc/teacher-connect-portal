import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TeachersFilters } from "./teachers/TeachersFilters";
import { TeachersGrid } from "./teachers/TeachersGrid";
import { RandomTeachersButton } from "./teachers/RandomTeachersButton";
import { useTeachersData } from "@/hooks/useTeachersData";
import { useTeachersFilter } from "@/hooks/useTeachersFilter";
import { filterTeachers, getLocalizedName, getTeacherLocation, getLowestPrice, formatPrice } from "@/utils/teacherUtils";
import { useEffect } from "react";

interface TeachersListProps {
  initialSearchQuery?: string;
}

export const TeachersList = ({ initialSearchQuery = "" }: TeachersListProps) => {
  const { language } = useLanguage();
  const { data: teachers = [], isLoading: isLoadingTeachers } = useTeachersData();
  
  console.log('TeachersList - Component mounted');
  
  useEffect(() => {
    console.log('TeachersList - Language changed:', language);
  }, [language]);

  useEffect(() => {
    console.log('TeachersList - Teachers data updated:', teachers.length, 'teachers');
    return () => {
      console.log('TeachersList - Component will unmount');
    };
  }, [teachers]);

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
      console.log('Fetching subjects...');
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name_en');
      if (error) throw error;
      console.log('Subjects fetched:', data?.length);
      return data;
    }
  });

  const { data: schoolLevels = [] } = useQuery({
    queryKey: ['schoolLevels'],
    queryFn: async () => {
      console.log('Fetching school levels...');
      const { data, error } = await supabase
        .from('school_levels')
        .select('*')
        .order('name_en');
      if (error) throw error;
      console.log('School levels fetched:', data?.length);
      return data;
    }
  });

  const { data: allCities = [] } = useQuery({
    queryKey: ['allCities'],
    queryFn: async () => {
      console.log('Fetching cities...');
      const { data, error } = await supabase
        .from('cities')
        .select('*, region:regions(*)');
      if (error) throw error;
      console.log('Cities fetched:', data?.length);
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

  console.log('TeachersList - Filtered teachers:', {
    total: teachers.length,
    filtered: filteredTeachers.length,
    subject: selectedSubject,
    level: selectedLevel,
    query: searchQuery
  });

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