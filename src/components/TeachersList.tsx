import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TeachersFilters } from "./teachers/TeachersFilters";
import { TeachersGrid } from "./teachers/TeachersGrid";
import { RandomTeachersButton } from "./teachers/RandomTeachersButton";

interface TeachersListProps {
  initialSearchQuery?: string;
}

export const TeachersList = ({ initialSearchQuery = "" }: TeachersListProps) => {
  const { language } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const { data: teachers = [], isLoading: isLoadingTeachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      console.log('Fetching teachers data...');
      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers')
        .select(`
          *,
          city:cities(
            id,
            name_en,
            name_fr,
            name_lb,
            region:regions(
              id,
              name_en,
              name_fr,
              name_lb
            )
          )
        `);

      if (teachersError) {
        console.error('Error fetching teachers:', teachersError);
        throw teachersError;
      }

      // Process each teacher's data
      const processedTeachers = await Promise.all(teachersData.map(async (teacher) => {
        // Fetch subjects with a direct join to the subjects table
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('teacher_subjects')
          .select(`
            subject:subjects!inner(
              id,
              name_en,
              name_fr,
              name_lb
            )
          `)
          .eq('teacher_id', teacher.user_id);

        if (subjectsError) {
          console.error('Error fetching subjects for teacher:', teacher.user_id, subjectsError);
        }

        // Fetch school levels
        const { data: levelsData, error: levelsError } = await supabase
          .from('teacher_school_levels')
          .select('*')
          .eq('teacher_id', teacher.user_id);

        if (levelsError) {
          console.error('Error fetching levels for teacher:', teacher.user_id, levelsError);
        }

        // Fetch locations
        const { data: locationsData, error: locationsError } = await supabase
          .from('teacher_locations')
          .select('*')
          .eq('teacher_id', teacher.user_id);

        if (locationsError) {
          console.error('Error fetching locations for teacher:', teacher.user_id, locationsError);
        }

        // Fetch student cities
        const { data: studentCitiesData, error: citiesError } = await supabase
          .from('teacher_student_cities')
          .select('*')
          .eq('teacher_id', teacher.user_id);

        if (citiesError) {
          console.error('Error fetching student cities for teacher:', teacher.user_id, citiesError);
        }

        // Process profile picture URL
        const profilePictureUrl = teacher.profile_picture_url
          ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile-pictures/${teacher.profile_picture_url}`
          : null;

        console.log('Processed teacher data:', {
          ...teacher,
          teacher_subjects: subjectsData || [],
          teacher_school_levels: levelsData || [],
          teacher_locations: locationsData || [],
          teacher_student_cities: studentCitiesData || []
        });

        return {
          ...teacher,
          profile_picture_url: profilePictureUrl,
          teacher_subjects: subjectsData || [],
          teacher_school_levels: levelsData || [],
          teacher_locations: locationsData || [],
          teacher_student_cities: studentCitiesData || []
        };
      }));

      console.log('All processed teachers:', processedTeachers);
      return processedTeachers;
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

  const getTeacherLocation = (teacher: any) => {
    if (!teacher.city) return '';
    const cityName = getLocalizedName(teacher.city);
    const regionName = getLocalizedName(teacher.city.region);
    return `${cityName}, ${regionName}`;
  };

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

  const getCityTranslation = (cityName: string) => {
    const city = allCities.find(c => c.name_en === cityName);
    if (city) {
      return getLocalizedName(city);
    }
    return cityName;
  };

  const filteredTeachers = teachers.filter(teacher => {
    const teacherSubjects = teacher.teacher_subjects?.map(s => getLocalizedName(s.subject)) || [];
    const teacherLevels = teacher.teacher_school_levels?.map(l => l.school_level) || [];
    
    const matchesSubject = selectedSubject === "all" || teacherSubjects.includes(selectedSubject);
    const matchesLevel = selectedLevel === "all" || teacherLevels.includes(selectedLevel);
    
    const location = getTeacherLocation(teacher);
    const studentCities = teacher.teacher_student_cities?.map(c => getCityTranslation(c.city_name)) || [];
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
        getLocalizedName={getLocalizedName}
      />

      <TeachersGrid
        teachers={filteredTeachers}
        isLoading={isLoadingTeachers}
        getLocalizedName={getLocalizedName}
        getTeacherLocation={getTeacherLocation}
        getLowestPrice={getLowestPrice}
        formatPrice={formatPrice}
      />
    </div>
  );
};
