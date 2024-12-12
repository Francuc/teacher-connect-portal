import { supabase } from "./supabase";
import { faker } from "@faker-js/faker";
import { TeachingLocation } from "./constants";

const uploadProfilePicture = async (userId: string) => {
  try {
    // Fetch a random image
    const response = await fetch('https://picsum.photos/200');
    if (!response.ok) {
      throw new Error('Failed to fetch random image');
    }

    // Convert the response to a Blob
    const blob = await response.blob();
    const fileName = `${userId}-${Math.random()}.jpg`;

    // Upload the blob directly to Supabase storage
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

const createRandomTeacher = async () => {
  const userId = faker.datatype.uuid();
  const profilePicture = await uploadProfilePicture(userId);

  const { data, error } = await supabase
    .from('teachers')
    .insert({
      user_id: userId,
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      facebook_profile: faker.internet.url(),
      show_email: faker.datatype.boolean(),
      show_phone: faker.datatype.boolean(),
      show_facebook: faker.datatype.boolean(),
      bio: faker.lorem.paragraph(),
      city_id: faker.datatype.uuid(),
      profile_picture_url: profilePicture,
    });

  if (error) {
    console.error('Error creating random teacher:', error);
    throw error;
  }

  return data;
};

const createRandomTeachers = async (count: number) => {
  const promises = Array.from({ length: count }, createRandomTeacher);
  return Promise.all(promises);
};

export { createRandomTeachers };
