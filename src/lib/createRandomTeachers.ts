import { faker } from "@faker-js/faker";
import { supabase } from "./supabase";
import { uploadProfilePicture } from "./teachers/avatarUtils";
import { getRandomCity, getRandomSubjects, getRandomSchoolLevels } from "./teachers/databaseUtils";
import { getRandomPrice, generateTeacherData } from "./teachers/teacherUtils";

const createRandomTeacher = async () => {
  try {
    const userId = faker.string.uuid();
    const cityId = await getRandomCity();
    const profilePicture = await uploadProfilePicture(userId);
    const subjectIds = await getRandomSubjects();
    const schoolLevels = await getRandomSchoolLevels();
    const teacherData = generateTeacherData();

    // Create teacher profile
    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .insert({
        ...teacherData,
        user_id: userId,
        city_id: cityId,
        profile_picture_url: profilePicture,
        subscription_status: 'active', // Set status to active by default
      })
      .select()
      .single();

    if (teacherError) throw teacherError;

    // Add subjects
    const { error: subjectsError } = await supabase
      .from('teacher_subjects')
      .insert(
        subjectIds.map(subjectId => ({
          teacher_id: userId,
          subject_id: subjectId
        }))
      );

    if (subjectsError) throw subjectsError;

    // Add school levels
    const { error: levelsError } = await supabase
      .from('teacher_school_levels')
      .insert(
        schoolLevels.map(level => ({
          teacher_id: userId,
          school_level: level
        }))
      );

    if (levelsError) throw levelsError;

    // Add teaching locations with prices
    const locations = [
      { type: "Teacher's Place", price: getRandomPrice() },
      { type: "Student's Place", price: getRandomPrice() },
      { type: "Online", price: getRandomPrice() }
    ];

    const { error: locationsError } = await supabase
      .from('teacher_locations')
      .insert(
        locations.map(loc => ({
          teacher_id: userId,
          location_type: loc.type,
          price_per_hour: loc.price
        }))
      );

    if (locationsError) throw locationsError;

    return teacher;
  } catch (error) {
    console.error('Error in createRandomTeacher:', error);
    throw error;
  }
};

export const createRandomTeachers = async (count: number = 1) => {
  try {
    console.log('Starting to create random teachers...');
    const promises = Array.from({ length: count }, createRandomTeacher);
    const results = await Promise.all(promises);
    console.log('Successfully created random teachers:', results);
    return results;
  } catch (error) {
    console.error('Error creating random teachers:', error);
    throw error;
  }
};