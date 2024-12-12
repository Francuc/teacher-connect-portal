import { supabase } from "./supabase";

export const createRandomTeachers = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('create-random-teachers', {
      method: 'POST'
    });

    if (error) {
      console.error('Error creating random teachers:', error);
      throw error;
    }

    console.log('Random teachers created:', data);
    return data;
  } catch (error) {
    console.error('Error invoking function:', error);
    throw error;
  }
};