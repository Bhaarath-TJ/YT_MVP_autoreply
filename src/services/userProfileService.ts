import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('Authentication required');
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error fetching user profile:', error);
    throw new Error(error.message);
  }

  return data;
};

export const updateCustomInstructions = async (instructions: string): Promise<void> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('Authentication required');
  }

  const { data: existingProfile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (existingProfile) {
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        custom_instructions: instructions,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('user_profiles')
      .insert([{
        user_id: user.id,
        custom_instructions: instructions
      }]);

    if (error) throw new Error(error.message);
  }
};