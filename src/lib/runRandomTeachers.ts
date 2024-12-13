import { createRandomTeachers } from "./createRandomTeachers";

export const runRandomTeachers = async () => {
  try {
    console.log('Starting to create 10 random teachers...');
    const result = await createRandomTeachers(10);
    console.log('Random teachers created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error creating random teachers:', error);
    throw error;
  }
};

runRandomTeachers();