import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History',
  'Geography', 'English', 'French', 'German', 'Computer Science'
];

const schoolLevels = [
  'Primary School', 'Middle School', 'High School', 'University'
];

const regions = [
  'Luxembourg City', 'Esch-sur-Alzette', 'Differdange', 'Dudelange'
];

const cities = [
  'Luxembourg City', 'Esch-sur-Alzette', 'Differdange', 'Dudelange',
  'Bettembourg', 'Schifflange', 'Kayl', 'Rumelange'
];

const getRandomItems = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomPrice = () => Math.floor(Math.random() * (80 - 30) + 30);

const generateRandomTeacher = () => ({
  first_name: ['John', 'Jane', 'Michael', 'Sarah'][Math.floor(Math.random() * 4)],
  last_name: ['Smith', 'Johnson', 'Williams', 'Brown'][Math.floor(Math.random() * 4)],
  email: `teacher${Math.random().toString(36).substring(7)}@example.com`,
  phone: `+352 ${Math.floor(Math.random() * 900000000) + 100000000}`,
  facebook_profile: `https://facebook.com/profile${Math.floor(Math.random() * 1000)}`,
  show_email: true,
  show_phone: Math.random() > 0.5,
  show_facebook: Math.random() > 0.5,
  bio: "I am an experienced teacher passionate about helping students learn and grow. I specialize in creating engaging lessons that make complex subjects easy to understand.",
  profile_picture_url: `https://picsum.photos/seed/${Math.random()}/200/200`,
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting to create random teachers...');

    // Create two random teachers
    for (let i = 0; i < 2; i++) {
      // 1. Create auth user
      const password = 'password123';
      const teacherData = generateRandomTeacher();
      
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: teacherData.email,
        password: password,
        email_confirm: true
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        throw authError;
      }

      const userId = authUser.user.id;
      console.log(`Created auth user with ID: ${userId}`);

      // 2. Create teacher profile
      const { error: profileError } = await supabase
        .from('teachers')
        .insert({
          ...teacherData,
          user_id: userId,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Error creating teacher profile:', profileError);
        throw profileError;
      }

      console.log(`Created teacher profile for ${teacherData.first_name}`);

      // 3. Add subjects
      const teacherSubjects = getRandomItems(subjects, 3).map(subject => ({
        teacher_id: userId,
        subject: subject
      }));

      const { error: subjectsError } = await supabase
        .from('teacher_subjects')
        .insert(teacherSubjects);

      if (subjectsError) {
        console.error('Error adding subjects:', subjectsError);
        throw subjectsError;
      }

      // 4. Add school levels
      const teacherLevels = getRandomItems(schoolLevels, 2).map(level => ({
        teacher_id: userId,
        school_level: level
      }));

      const { error: levelsError } = await supabase
        .from('teacher_school_levels')
        .insert(teacherLevels);

      if (levelsError) {
        console.error('Error adding school levels:', levelsError);
        throw levelsError;
      }

      // 5. Add teaching locations
      const locations = ["Teacher's Place", "Student's Place", "Online"];
      const teacherLocations = locations.map(location => ({
        teacher_id: userId,
        location_type: location,
        price_per_hour: getRandomPrice()
      }));

      const { error: locationsError } = await supabase
        .from('teacher_locations')
        .insert(teacherLocations);

      if (locationsError) {
        console.error('Error adding locations:', locationsError);
        throw locationsError;
      }

      // 6. Add student regions and cities
      const teacherRegions = getRandomItems(regions, 2).map(region => ({
        teacher_id: userId,
        region_name: region
      }));

      const { error: regionsError } = await supabase
        .from('teacher_student_regions')
        .insert(teacherRegions);

      if (regionsError) {
        console.error('Error adding regions:', regionsError);
        throw regionsError;
      }

      const teacherCities = getRandomItems(cities, 3).map(city => ({
        teacher_id: userId,
        city_name: city
      }));

      const { error: citiesError } = await supabase
        .from('teacher_student_cities')
        .insert(teacherCities);

      if (citiesError) {
        console.error('Error adding cities:', citiesError);
        throw citiesError;
      }

      console.log(`Completed creating teacher ${teacherData.first_name}`);
    }

    return new Response(
      JSON.stringify({ message: 'Successfully created 2 random teachers' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});