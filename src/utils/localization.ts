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