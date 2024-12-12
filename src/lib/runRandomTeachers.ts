import { createRandomTeachers } from "./createRandomTeachers";

export const runRandomTeachers = async () => {
  try {
    console.log('Starting to create random teachers...');
    const result = await createRandomTeachers();
    console.log('Random teachers created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error creating random teachers:', error);
    throw error;
  }
};

// Execute immediately
runRandomTeachers();