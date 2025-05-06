import { supabase } from '../lib/supabase';
import { UserUsage } from '../types';

export const getUserUsage = async (): Promise<UserUsage | null> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('Authentication required');
  }

  const { data, error } = await supabase
    .from('user_usage')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error fetching user usage:', error);
    throw new Error(error.message);
  }

  return data;
};

export const updateUserUsage = async (repliesCount: number): Promise<void> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('Authentication required');
  }

  const { data: existingUsage } = await supabase
    .from('user_usage')
    .select('total_replies_generated')
    .eq('user_id', user.id)
    .single();

  if (existingUsage) {
    const { error } = await supabase
      .from('user_usage')
      .update({ 
        total_replies_generated: existingUsage.total_replies_generated + repliesCount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('user_usage')
      .insert([{
        user_id: user.id,
        total_replies_generated: repliesCount
      }]);

    if (error) throw new Error(error.message);
  }
};