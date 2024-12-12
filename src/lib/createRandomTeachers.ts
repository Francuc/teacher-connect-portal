import { createClient } from '@supabase/supabase-js'

// Create a single service role client instance with explicit configuration
const serviceRoleClient = createClient(
  'https://qhqtflpajutstecqajbl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocXRmbHBhanV0c3RlY3FhamJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzk2MTQ5OCwiZXhwIjoyMDQ5NTM3NDk4fQ.qNnjcPx2LJENXn-Ow_vPRUpyGl-CJLRFxUUXhrj_K3k',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const getRandomProfilePicture = async (userId: string): Promise<string> => {
  try {
    // Fetch a random image from picsum
    const response = await fetch('https://picsum.photos/400/400');
    if (!response.ok) {
      throw new Error('Failed to fetch random image');
    }

    // Get the image data as a buffer
    const buffer = await response.arrayBuffer();
    const fileName = `${userId}-${Math.random()}.jpg`;

    // Upload the buffer directly to Supabase storage
    const { error: uploadError } = await serviceRoleClient.storage
      .from('profile-pictures')
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
        duplex: 'half',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading profile picture:', uploadError);
      throw uploadError;
    }

    // Get the public URL after successful upload
    const { data: { publicUrl } } = serviceRoleClient.storage
      .from('profile-pictures')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error in getRandomProfilePicture:', error);
    throw error;
  }
};

const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History',
  'Geography', 'English', 'French', 'Computer Science'
];

const schoolLevels = [
  'Primary School', 'Middle School', 'High School', 'University'
];

const getRandomItems = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomPrice = () => Math.floor(Math.random() * (80 - 30) + 30);

const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Sophie'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore'];

export const createRandomTeachers = async () => {
  try {
    console.log('Starting to create random teachers...');

    // Create two random teachers
    for (let i = 0; i < 2; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const userId = crypto.randomUUID();
      
      // Get a random profile picture
      const profilePictureUrl = await getRandomProfilePicture(userId);
      
      // 1. Create teacher profile
      const { error: profileError } = await serviceRoleClient
        .from('teachers')
        .insert({
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          phone: `+352 ${Math.floor(Math.random() * 900000000) + 100000000}`,
          facebook_profile: `https://facebook.com/profile${Math.floor(Math.random() * 1000)}`,
          show_email: true,
          show_phone: Math.random() > 0.5,
          show_facebook: Math.random() > 0.5,
          bio: `Hi, I'm ${firstName}! I'm an experienced teacher passionate about helping students learn and grow. I specialize in creating engaging lessons that make complex subjects easy to understand.`,
          profile_picture_url: profilePictureUrl,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Error creating teacher profile:', profileError);
        throw profileError;
      }

      console.log(`Created teacher profile for ${firstName} ${lastName}`);

      // 2. Add random subjects (2-4 subjects per teacher)
      const { data: allSubjects } = await serviceRoleClient
        .from('subjects')
        .select('id');
      
      if (allSubjects) {
        const selectedSubjects = getRandomItems(allSubjects, Math.floor(Math.random() * 3) + 2);
        
        for (const subject of selectedSubjects) {
          const { error: subjectError } = await serviceRoleClient
            .from('teacher_subjects')
            .insert({
              teacher_id: userId,
              subject_id: subject.id
            });

          if (subjectError) {
            console.error('Error adding subject:', subjectError);
            throw subjectError;
          }
        }
      }

      // 3. Add random school levels (1-3 levels per teacher)
      const selectedLevels = getRandomItems(schoolLevels, Math.floor(Math.random() * 3) + 1);
      for (const level of selectedLevels) {
        const { error: levelError } = await serviceRoleClient
          .from('teacher_school_levels')
          .insert({
            teacher_id: userId,
            school_level: level
          });

        if (levelError) {
          console.error('Error adding school level:', levelError);
          throw levelError;
        }
      }

      // 4. Add teaching locations with random prices
      const locations = ["Teacher's Place", "Student's Place", "Online"];
      for (const location of locations) {
        const { error: locationError } = await serviceRoleClient
          .from('teacher_locations')
          .insert({
            teacher_id: userId,
            location_type: location,
            price_per_hour: getRandomPrice()
          });

        if (locationError) {
          console.error('Error adding location:', locationError);
          throw locationError;
        }
      }

      console.log(`Completed creating teacher ${firstName} ${lastName}`);
    }

    return { success: true, message: 'Successfully created 2 random teachers' };
  } catch (error) {
    console.error('Error creating random teachers:', error);
    throw error;
  }
};