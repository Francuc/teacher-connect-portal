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

const createRandomTeacher = async () => {
  try {
    const userId = faker.string.uuid();
    const cityId = await getRandomCity();
    const profilePicture = await uploadProfilePicture(userId);

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
        profile_picture_url: profilePicture,
      })
      .select()
      .single();

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