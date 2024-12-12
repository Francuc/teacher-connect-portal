import { supabase } from "@/lib/supabase";
import { FormData } from "../types";

export const handleRelationsUpdate = async (
  formData: FormData,
  userId: string
): Promise<{ error?: Error }> => {
  try {
    // Update subjects
    await supabase
      .from('teacher_subjects')
      .delete()
      .eq('teacher_id', userId);

    if (formData.subjects.length > 0) {
      await supabase
        .from('teacher_subjects')
        .insert(
          formData.subjects.map(subject => ({
            teacher_id: userId,
            subject_id: subject.subject_id
          }))
        );
    }

    // Update school levels
    await supabase
      .from('teacher_school_levels')
      .delete()
      .eq('teacher_id', userId);

    if (formData.schoolLevels.length > 0) {
      await supabase
        .from('teacher_school_levels')
        .insert(
          formData.schoolLevels.map(level => ({
            teacher_id: userId,
            school_level: level
          }))
        );
    }

    // Update teaching locations
    await supabase
      .from('teacher_locations')
      .delete()
      .eq('teacher_id', userId);

    const locationInserts = formData.teachingLocations.map(location => {
      let priceKey: keyof typeof formData.pricePerHour;
      switch (location) {
        case "Teacher's Place":
          priceKey = "teacherPlace";
          break;
        case "Student's Place":
          priceKey = "studentPlace";
          break;
        case "Online":
          priceKey = "online";
          break;
        default:
          priceKey = "online";
      }
      
      return {
        teacher_id: userId,
        location_type: location,
        price_per_hour: parseFloat(formData.pricePerHour[priceKey]) || 0
      };
    });

    if (locationInserts.length > 0) {
      await supabase
        .from('teacher_locations')
        .insert(locationInserts);
    }

    // Update student regions
    await supabase
      .from('teacher_student_regions')
      .delete()
      .eq('teacher_id', userId);

    if (formData.studentRegions.length > 0) {
      await supabase
        .from('teacher_student_regions')
        .insert(
          formData.studentRegions.map(region => ({
            teacher_id: userId,
            region_name: region
          }))
        );
    }

    // Update student cities
    await supabase
      .from('teacher_student_cities')
      .delete()
      .eq('teacher_id', userId);

    if (formData.studentCities.length > 0) {
      await supabase
        .from('teacher_student_cities')
        .insert(
          formData.studentCities.map(city => ({
            teacher_id: userId,
            city_name: city
          }))
        );
    }

    return {};
  } catch (error) {
    console.error('Error in handleRelationsUpdate:', error);
    return { error: error as Error };
  }
};