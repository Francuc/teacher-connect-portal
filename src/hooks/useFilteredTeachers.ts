import { useMemo } from "react";
import { getLocalizedName, getTeacherLocation } from "@/utils/teacherUtils";

export const useFilteredTeachers = (
  teachers: any[],
  selectedSubject: string,
  selectedLevel: string,
  searchQuery: string,
  language: string
) => {
  return useMemo(() => {
    console.log('Filtering teachers with criteria:', { selectedSubject, selectedLevel, searchQuery });
    
    return teachers.filter(teacher => {
      const teacherSubjects = teacher.teacher_subjects?.map((s: any) => getLocalizedName(s.subject, language)) || [];
      const teacherLevels = teacher.teacher_school_levels?.map((l: any) => l.school_level) || [];
      
      const matchesSubject = selectedSubject === "all" || teacherSubjects.includes(selectedSubject);
      const matchesLevel = selectedLevel === "all" || teacherLevels.includes(selectedLevel);
      
      const location = getTeacherLocation(teacher, language);
      const studentCities = teacher.teacher_student_cities?.map((c: any) => c.city_name) || [];
      const allLocations = [location, ...studentCities];
      
      const matchesSearch = !searchQuery || 
        `${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        allLocations.some(loc => loc.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesSubject && matchesLevel && matchesSearch;
    });
  }, [teachers, selectedSubject, selectedLevel, searchQuery, language]);
};