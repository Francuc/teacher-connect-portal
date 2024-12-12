import { supabase } from "@/lib/supabase";
import { FormData } from "../types";

export const handleRelationsUpdate = async (
  formData: FormData,
  userId: string
): Promise<{ error?: Error }> => {
  try {
    // Delete existing relations
    const deletePromises = [
      supabase.from('teacher_subjects').delete().eq('teacher_id', userId),
      supabase.from('teacher_school_levels').delete().eq('teacher_id', userId),
      supabase.from('teacher_locations').delete().eq('teacher_id', userId),
      supabase.from('teacher_student_regions').delete().eq('teacher_id', userId),
      supabase.from('teacher_student_cities').delete().eq('teacher_id', userId)
    ];

    const deleteResults = await Promise.all(deletePromises);
    const deleteErrors = deleteResults.filter(result => result.error);
    if (deleteErrors.length > 0) {
      console.error('Error deleting existing relations:', deleteErrors);
      throw new Error('Error deleting existing relations');
    }

    // Insert new relations
    const insertPromises = [];

    if (formData.subjects.length > 0) {
      insertPromises.push(
        supabase
          .from('teacher_subjects')
          .insert(
            formData.subjects.map(subject => ({
              teacher_id: userId,
              subject: subject
            }))
          )
      );
    }

    if (formData.schoolLevels.length > 0) {
      insertPromises.push(
        supabase
          .from('teacher_school_levels')
          .insert(
            formData.schoolLevels.map(level => ({
              teacher_id: userId,
              school_level: level
            }))
          )
      );
    }

    if (formData.teachingLocations.length > 0) {
      insertPromises.push(
        supabase
          .from('teacher_locations')
          .insert(
            formData.teachingLocations.map(location => ({
              teacher_id: userId,
              location_type: location,
              price_per_hour: parseFloat(formData.pricePerHour[
                location.toLowerCase().replace("'s", "").split(" ")[0] as keyof typeof formData.pricePerHour
              ] || '0')
            }))
          )
      );
    }

    if (formData.studentRegions.length > 0) {
      insertPromises.push(
        supabase
          .from('teacher_student_regions')
          .insert(
            formData.studentRegions.map(region => ({
              teacher_id: userId,
              region_name: region
            }))
          )
      );
    }

    if (formData.studentCities.length > 0) {
      insertPromises.push(
        supabase
          .from('teacher_student_cities')
          .insert(
            formData.studentCities.map(city => ({
              teacher_id: userId,
              city_name: city
            }))
          )
      );
    }

    const insertResults = await Promise.all(insertPromises);
    const insertErrors = insertResults.filter(result => result.error);
    if (insertErrors.length > 0) {
      console.error('Error inserting new relations:', insertErrors);
      throw new Error('Error inserting new relations');
    }

    return {};
  } catch (error) {
    console.error('Error in handleRelationsUpdate:', error);
    return { error: error as Error };
  }
};