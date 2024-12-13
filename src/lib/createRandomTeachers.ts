import { supabase } from "./supabase";
import { faker } from "@faker-js/faker";

const uploadProfilePicture = async (userId: string) => {
  try {
    // Using DiceBear instead of Picsum for more reliable avatar generation
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
    const response = await fetch(avatarUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch avatar');
    }
    const blob = await response.blob();
    const fileName = `${userId}-${Math.random()}.svg`;

    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(fileName, blob, {
        contentType: 'image/svg+xml',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading profile picture:', uploadError);
      throw uploadError;
    }

    return fileName;
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    throw error;
  }
};

const getRandomCity = async () => {
  const { data: cities, error } = await supabase
    .from('cities')
    .select('id')
    .limit(100);

  if (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }

  if (!cities || cities.length === 0) {
    throw new Error('No cities found in the database');
  }

  return cities[Math.floor(Math.random() * cities.length)].id;
};

const getRandomSubjects = async (count: number = 2) => {
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('id')
    .limit(100);

  if (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }

  if (!subjects || subjects.length === 0) {
    throw new Error('No subjects found in the database');
  }

  // Randomly select 'count' number of subjects
  return subjects
    .sort(() => 0.5 - Math.random())
    .slice(0, count)
    .map(subject => subject.id);
};

const getRandomSchoolLevels = async (count: number = 2) => {
  const { data: levels, error } = await supabase
    .from('school_levels')
    .select('name_en');

  if (error) {
    console.error('Error fetching school levels:', error);
    throw error;
  }

  if (!levels || levels.length === 0) {
    throw new Error('No school levels found in the database');
  }

  // Randomly select 'count' number of levels
  return levels
    .sort(() => 0.5 - Math.random())
    .slice(0, count)
    .map(level => level.name_en);
};

const getRandomPrice = () => Math.floor(Math.random() * (80 - 30) + 30);

const createRandomTeacher = async () => {
  try {
    const userId = faker.string.uuid();
    const cityId = await getRandomCity();
    const profilePicture = await uploadProfilePicture(userId);
    const subjectIds = await getRandomSubjects();
    const schoolLevels = await getRandomSchoolLevels();

    // 1. Create teacher profile
    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .insert({
        user_id: userId,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        facebook_profile: faker.internet.url(),
        show_email: faker.datatype.boolean(),
        show_phone: faker.datatype.boolean(),
        show_facebook: faker.datatype.boolean(),
        bio: faker.lorem.paragraph(),
        city_id: cityId,
        profile_picture_url: profilePicture,
      })
      .select()
      .single();

    if (teacherError) throw teacherError;

    // 2. Add subjects
    const { error: subjectsError } = await supabase
      .from('teacher_subjects')
      .insert(
        subjectIds.map(subjectId => ({
          teacher_id: userId,
          subject_id: subjectId
        }))
      );

    if (subjectsError) throw subjectsError;

    // 3. Add school levels
    const { error: levelsError } = await supabase
      .from('teacher_school_levels')
      .insert(
        schoolLevels.map(level => ({
          teacher_id: userId,
          school_level: level
        }))
      );

    if (levelsError) throw levelsError;

    // 4. Add teaching locations with prices
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

    // 5. Add student regions and cities
    const { data: regions } = await supabase
      .from('regions')
      .select('name_en')
      .limit(2);

    if (regions) {
      const { error: regionsError } = await supabase
        .from('teacher_student_regions')
        .insert(
          regions.map(region => ({
            teacher_id: userId,
            region_name: region.name_en
          }))
        );

      if (regionsError) throw regionsError;
    }

    const { data: cities } = await supabase
      .from('cities')
      .select('name_en')
      .limit(3);

    if (cities) {
      const { error: citiesError } = await supabase
        .from('teacher_student_cities')
        .insert(
          cities.map(city => ({
            teacher_id: userId,
            city_name: city.name_en
          }))
        );

      if (citiesError) throw citiesError;
    }

    return teacher;
  } catch (error) {
    console.error('Error in createRandomTeacher:', error);
    throw error;
  }
};

export const createRandomTeachers = async (count: number = 5) => {
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