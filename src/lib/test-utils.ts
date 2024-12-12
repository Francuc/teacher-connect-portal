import { createRandomTeachers } from "./createRandomTeachers";

// Expose the function to the window object for testing
declare global {
  interface Window {
    createRandomTeachers: () => Promise<void>;
  }
}

// Expose the function to the window object for testing
window.createRandomTeachers = async () => {
  try {
    const result = await createRandomTeachers();
    console.log('Random teachers created successfully:', result);
  } catch (error) {
    console.error('Error creating random teachers:', error);
  }
};