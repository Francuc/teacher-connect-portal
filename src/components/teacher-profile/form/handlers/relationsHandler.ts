import { supabase } from "@/lib/supabase";
import { FormData } from "../types";

export const handleRelationsUpdate = async (
  formData: FormData,
  userId: string
): Promise<{ error?: Error }> => {
  try {
    console.log('Starting relations update for user:', userId);
    
    // Delete existing relations
    const deletePromises = [
      supabase.from('teacher_subjects').delete().eq('teacher_id', userId),
      supabase.from('teacher_school_levels').delete().eq('teacher_id', userId),
      supabase.from('teacher_locations').delete().eq('teacher_id', userId),
      supabase.from('teacher_student_regions').delete().eq('teacher_id', userId),
      supabase.from('teacher_student_cities').delete().eq('teacher_id', userId)
    ];

    console.log('Deleting existing relations...');
    const deleteResults = await Promise.all(deletePromises);
    const deleteErrors = deleteResults.filter(result => result.error);
    if (deleteErrors.length > 0) {
      console.error('Error deleting existing relations:', deleteErrors);
      throw new Error('Error deleting existing relations');
    }

    // Insert new relations
    const insertPromises = [];

    // Insert subjects
    if (formData.subjects.length > 0) {
      console.log('Inserting subjects:', formData.subjects);
      insertPromises.push(
        supabase
          .from('teacher_subjects')
          .insert(
            formData.subjects.map(subject => ({
              teacher_id: userId,
              subject_id: subject.subject_id
            }))
          )
      );
    }

    // Insert school levels
    if (formData.schoolLevels.length > 0) {
      console.log('Inserting school levels:', formData.schoolLevels);
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

    // Insert teaching locations
    if (formData.teachingLocations.length > 0) {
      const locationData = formData.teachingLocations.map(location => {
        let price = 0;
        if (location === "Teacher's Place") {
          price = parseFloat(formData.pricePerHour.teacherPlace) || 0;
        } else if (location === "Student's Place") {
          price = parseFloat(formData.pricePerHour.studentPlace) || 0;
        } else if (location === "Online") {
          price = parseFloat(formData.pricePerHour.online) || 0;
        }
        
        return {
          teacher_id: userId,
          location_type: location,
          price_per_hour: price
        };
      });

      insertPromises.push(
        supabase
          .from('teacher_locations')
          .insert(locationData)
      );
    }

    // Insert student regions
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

    // Insert student cities
    if (formData.studentCities.length > 0) {
      insertPromises.push(
        supabase
          .from('teacher_student_cities')
          .insert(
            formData.studentCities.map(cityId => ({
              teacher_id: userId,
              city_id: cityId
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

// Add the missing handleRelationsCreation function
export const handleRelationsCreation = async (formData: FormData, userId: string) => {
  return handleRelationsUpdate(formData, userId);
};