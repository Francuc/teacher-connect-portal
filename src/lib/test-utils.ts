import { createRandomTeachers } from "./createRandomTeachers";

declare global {
  interface Window {
    createRandomTeachers: () => Promise<void>;
  }
}

window.createRandomTeachers = async () => {
  try {
    const result = await createRandomTeachers(5);
    console.log('Random teachers created successfully:', result);
  } catch (error) {
    console.error('Error creating random teachers:', error);
  }
};