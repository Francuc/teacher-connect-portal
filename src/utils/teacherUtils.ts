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