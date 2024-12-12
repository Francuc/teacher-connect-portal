import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TeachersFilters } from "./teachers/TeachersFilters";
import { TeachersGrid } from "./teachers/TeachersGrid";
import { RandomTeachersButton } from "./teachers/RandomTeachersButton";
import { useTeachersData } from "@/hooks/useTeachersData";
import { getLocalizedName, getTeacherLocation } from "@/utils/localization";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface TeachersListProps {
  initialSearchQuery?: string;
}

export const TeachersList = ({ initialSearchQuery = "" }: TeachersListProps) => {
  const { language } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const { data: teachers = [], isLoading: isLoadingTeachers } = useTeachersData();

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

  const { data: schoolLevels = [] } = useQuery({
    queryKey: ['school_levels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_levels')
        .select('*')
        .order('name_en');
      
      if (error) throw error;
      return data || [];
    },
  });

  const getLowestPrice = (locations: any[]) => {
    if (!locations || locations.length === 0) return null;
    const prices = locations.map(loc => loc.price_per_hour);
    return Math.min(...prices);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const filteredTeachers = teachers.filter(teacher => {
    const teacherSubjects = teacher.teacher_subjects?.map(s => getLocalizedName(s.subject, language)) || [];
    const teacherLevels = teacher.teacher_school_levels?.map(l => l.school_level) || [];
    
    const matchesSubject = selectedSubject === "all" || teacherSubjects.includes(selectedSubject);
    const matchesLevel = selectedLevel === "all" || teacherLevels.includes(selectedLevel);
    
    const location = getTeacherLocation(teacher, language);
    const studentCities = teacher.teacher_student_cities?.map(c => c.city_name) || [];
    const allLocations = [location, ...studentCities];
    
    const matchesSearch = !searchQuery || 
      `${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      allLocations.some(loc => loc.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSubject && matchesLevel && matchesSearch;
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
