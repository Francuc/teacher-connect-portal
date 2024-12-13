export const getLocalizedName = (item: any, language: string) => {
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

export const getTeacherLocation = (teacher: any, language: string) => {
  if (!teacher.city) return '';
  const cityName = getLocalizedName(teacher.city, language);
  const regionName = getLocalizedName(teacher.city.region, language);
  return `${cityName}, ${regionName}`;
};

export const getLowestPrice = (locations: any[]) => {
  if (!locations || locations.length === 0) return null;
  const prices = locations.map(loc => loc.price_per_hour);
  return Math.min(...prices);
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const filterTeachers = (
  teachers: any[],
  selectedSubject: string,
  selectedLevel: string,
  searchQuery: string,
  getLocalizedName: (item: any) => string,
  getTeacherLocation: (teacher: any) => string,
  getCityTranslation: (cityName: string) => string
) => {
  return teachers.filter(teacher => {
    const teacherSubjects = teacher.teacher_subjects?.map((s: any) => getLocalizedName(s.subject)) || [];
    const teacherLevels = teacher.teacher_school_levels?.map((l: any) => l.school_level) || [];
    
    const matchesSubject = selectedSubject === "all" || teacherSubjects.includes(selectedSubject);
    const matchesLevel = selectedLevel === "all" || teacherLevels.includes(selectedLevel);
    
    const location = getTeacherLocation(teacher);
    const studentCities = teacher.teacher_student_cities?.map((c: any) => getCityTranslation(c.city_name)) || [];
    const allLocations = [location, ...studentCities];
    
    const matchesSearch = !searchQuery || 
      `${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      allLocations.some(loc => loc.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSubject && matchesLevel && matchesSearch;
  });
};