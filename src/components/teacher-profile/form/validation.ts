import { FormData } from "./types";

export const validateForm = (formData: FormData, t: (key: string) => string) => {
  const errors: string[] = [];

  // Required personal info
  if (!formData.firstName) errors.push(t("firstName"));
  if (!formData.lastName) errors.push(t("lastName"));
  if (!formData.email) errors.push(t("email"));
  if (!formData.bio) errors.push(t("bio"));

  // Validate subjects (at least one required)
  if (formData.subjects.length === 0) {
    errors.push(t("selectAtLeastOneSubject"));
  }

  // Validate school levels (at least one required)
  if (formData.schoolLevels.length === 0) {
    errors.push(t("selectAtLeastOneLevel"));
  }

  // Validate teaching locations (at least one required)
  if (formData.teachingLocations.length === 0) {
    errors.push(t("selectAtLeastOneLocation"));
  }

  // Validate prices for each selected location
  formData.teachingLocations.forEach(location => {
    switch (location) {
      case "Teacher's Place":
        if (!formData.cityId) {
          errors.push(t("teacherCityRequired"));
        }
        if (!formData.pricePerHour.teacherPlace || parseFloat(formData.pricePerHour.teacherPlace) <= 0) {
          errors.push(t("validPriceRequiredForTeacherPlace"));
        }
        break;
      case "Student's Place":
        if (!formData.pricePerHour.studentPlace || parseFloat(formData.pricePerHour.studentPlace) <= 0) {
          errors.push(t("validPriceRequiredForStudentPlace"));
        }
        if (formData.studentRegions.length === 0 && formData.studentCities.length === 0) {
          errors.push(t("selectAtLeastOneRegionOrCity"));
        }
        break;
      case "Online":
        if (!formData.pricePerHour.online || parseFloat(formData.pricePerHour.online) <= 0) {
          errors.push(t("validPriceRequiredForOnline"));
        }
        break;
    }
  });

  return errors;
};