import { FormData } from "./types";

export const validateForm = (formData: FormData, t: (key: string) => string) => {
  const errors: string[] = [];

  if (!formData.firstName) errors.push(t("firstName"));
  if (!formData.lastName) errors.push(t("lastName"));
  if (!formData.email) errors.push(t("email"));
  if (!formData.bio) errors.push(t("bio"));
  if (formData.subjects.length === 0) errors.push(t("subjects"));
  if (formData.schoolLevels.length === 0) errors.push(t("schoolLevels"));
  if (formData.teachingLocations.length === 0) errors.push(t("teachingLocations"));
  
  if (formData.teachingLocations.includes("Teacher's Place") && !formData.cityId) {
    errors.push(t("teacherCity"));
  }

  // Check if at least one teaching location has a price
  const hasValidPrice = formData.teachingLocations.some(location => {
    const price = formData.pricePerHour[
      location.toLowerCase().replace("'s", "").split(" ")[0] as keyof typeof formData.pricePerHour
    ];
    return price && parseFloat(price) > 0;
  });

  if (!hasValidPrice) {
    errors.push(t("pricePerHour"));
  }

  return errors;
};