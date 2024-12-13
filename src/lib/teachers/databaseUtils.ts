import { supabase } from "../supabase";

export const getRandomCity = async () => {
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

export const getRandomSubjects = async (count: number = 2) => {
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

  return subjects
    .sort(() => 0.5 - Math.random())
    .slice(0, count)
    .map(subject => subject.id);
};

export const getRandomSchoolLevels = async (count: number = 2) => {
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

  return levels
    .sort(() => 0.5 - Math.random())
    .slice(0, count)
    .map(level => level.name_en);
};