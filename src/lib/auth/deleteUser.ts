import { supabase } from '@/lib/supabase';

export const deleteUser = async (email: string) => {
  try {
    // First get the user data to get the ID
    const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers();
    
    if (fetchError) throw fetchError;
    
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('User not found');

    // Call our delete-profile edge function
    const { error } = await supabase.functions.invoke('delete-profile', {
      body: { userId: user.id }
    });

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error };
  }
}