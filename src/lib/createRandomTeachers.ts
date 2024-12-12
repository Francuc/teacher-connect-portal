import { supabase } from "./supabase";
import { faker } from "@faker-js/faker";

const uploadProfilePicture = async (userId: string) => {
  try {
    const response = await fetch('https://picsum.photos/200');
    if (!response.ok) {
      throw new Error('Failed to fetch random image');
    }
    const blob = await response.blob();
    const fileName = `${userId}-${Math.random()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
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

const getRandomCityId = async () => {
  const { data: cities, error } = await supabase
    .from('cities')
    .select('id')
    .limit(100);
  
  if (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
  
  if (!cities || cities.length === 0) {
    console.error('No cities found in database');
    throw new Error('No cities available');
  }

  const randomIndex = Math.floor(Math.random() * cities.length);
  return cities[randomIndex].id;
};

const createRandomTeacher = async () => {
  try {
    const userId = faker.string.uuid();
    const profilePicture = await uploadProfilePicture(userId);
    const cityId = await getRandomCityId();

    const { data, error } = await supabase
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
        profile_picture_url: profilePicture
      });

    if (error) {
      console.error('Error creating random teacher:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createRandomTeacher:', error);
    throw error;
  }
};

export const createRandomTeachers = async (count: number = 5) => {
  try {
    const promises = Array.from({ length: count }, createRandomTeacher);
    return Promise.all(promises);
  } catch (error) {
    console.error('Error creating random teachers:', error);
    throw error;
  }
};