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

    if (formData.subjects.length > 0) {
      console.log('Inserting subjects:', formData.subjects);
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

    if (formData.teachingLocations.length > 0) {
      const locationData = formData.teachingLocations.map(location => {
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
        
        const price = parseFloat(formData.pricePerHour[priceKey]) || 0;
        console.log(`Processing location ${location} with price ${price}`);
        
        return {
          teacher_id: userId,
          location_type: location,
          price_per_hour: price
        };
      });

      console.log('Inserting locations:', locationData);
      insertPromises.push(
        supabase
          .from('teacher_locations')
          .insert(locationData)
      );
    }

    if (formData.studentRegions.length > 0) {
      console.log('Inserting student regions:', formData.studentRegions);
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
      console.log('Inserting student cities:', formData.studentCities);
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

    console.log('Executing all insert operations...');
    const insertResults = await Promise.all(insertPromises);
    const insertErrors = insertResults.filter(result => result.error);
    if (insertErrors.length > 0) {
      console.error('Error inserting new relations:', insertErrors);
      throw new Error('Error inserting new relations');
    }

    console.log('Relations update completed successfully');
    return {};
  } catch (error) {
    console.error('Error in handleRelationsUpdate:', error);
    return { error: error as Error };
  }
};