import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const subjects = [
  "Mathematics", "Physics", "Chemistry", "Biology", 
  "French", "English", "German", "History", 
  "Geography", "Economics", "Computer Science"
];

const schoolLevels = [
  "Primary School", "Secondary School", "High School",
  "University", "Professional Training"
];

const locations = ["Teacher's Place", "Student's Place", "Online"];

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomPrice(): number {
  return Math.floor(Math.random() * (80 - 30) + 30);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get a random city for the teacher
    const { data: cities } = await supabase
      .from('cities')
      .select('id, name_en, region:regions(name_en)')
      .limit(1)
      .single();

    if (!cities) {
      throw new Error('No cities found');
    }

    // Create two random teachers
    for (let i = 0; i < 2; i++) {
      // Create auth user
      const email = `teacher${Date.now()}${i}@example.com`;
      const password = 'password123';
      
      const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (authError || !user) {
        throw authError || new Error('Failed to create user');
      }

      // Upload a random profile picture
      const imageResponse = await fetch('https://picsum.photos/400/400');
      const imageBlob = await imageResponse.blob();
      const fileName = `${user.id}-profile.jpg`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, imageBlob, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      // Create teacher profile
      const { error: profileError } = await supabase
        .from('teachers')
        .insert({
          user_id: user.id,
          first_name: `Teacher${i + 1}`,
          last_name: `Sample${i + 1}`,
          email: email,
          phone: `+352 ${Math.floor(Math.random() * 900000 + 100000)}`,
          facebook_profile: `https://facebook.com/teacher${i + 1}`,
          show_email: true,
          show_phone: true,
          show_facebook: true,
          bio: `I am an experienced teacher with a passion for education. I specialize in various subjects and adapt my teaching methods to each student's needs.`,
          profile_picture_url: publicUrl,
          city_id: cities.id,
        });

      if (profileError) {
        throw profileError;
      }

      // Add random subjects
      const teacherSubjects = getRandomItems(subjects, 3).map(subject => ({
        teacher_id: user.id,
        subject
      }));

      const { error: subjectsError } = await supabase
        .from('teacher_subjects')
        .insert(teacherSubjects);

      if (subjectsError) {
        throw subjectsError;
      }

      // Add random school levels
      const teacherLevels = getRandomItems(schoolLevels, 2).map(level => ({
        teacher_id: user.id,
        school_level: level
      }));

      const { error: levelsError } = await supabase
        .from('teacher_school_levels')
        .insert(teacherLevels);

      if (levelsError) {
        throw levelsError;
      }

      // Add teaching locations with random prices
      const teacherLocations = locations.map(location => ({
        teacher_id: user.id,
        location_type: location,
        price_per_hour: getRandomPrice()
      }));

      const { error: locationsError } = await supabase
        .from('teacher_locations')
        .insert(teacherLocations);

      if (locationsError) {
        throw locationsError;
      }

      // Add student regions and cities
      const { error: regionsError } = await supabase
        .from('teacher_student_regions')
        .insert({
          teacher_id: user.id,
          region_name: cities.region.name_en
        });

      if (regionsError) {
        throw regionsError;
      }

      const { error: citiesError } = await supabase
        .from('teacher_student_cities')
        .insert({
          teacher_id: user.id,
          city_name: cities.name_en
        });

      if (citiesError) {
        throw citiesError;
      }
    }

    return new Response(
      JSON.stringify({ message: 'Successfully created 2 random teacher profiles' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});