import { createClient } from '@supabase/supabase-js';
import { SavedReply } from '../types';
import { supabase } from '../lib/supabase';

interface SaveReplyParams {
  reply_text: string;
  original_comment: string;
  platform: string;
}

export const saveReply = async (params: SaveReplyParams): Promise<void> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('Authentication required');
  }

  const { error } = await supabase
    .from('saved_replies')
    .insert([{
      ...params,
      user_id: user.id
    }]);

  if (error) {
    console.error('Error saving reply:', error);
    if (error.code === '42501') {
      throw new Error('Permission denied: You can only save your own replies');
    }
    throw new Error(error.message);
  }
};

export const getSavedReplies = async (): Promise<SavedReply[]> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('Authentication required');
  }

  const { data, error } = await supabase
    .from('saved_replies')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved replies:', error);
    throw new Error(error.message);
  }

  return data as SavedReply[];
};

export const deleteSavedReply = async (id: string): Promise<void> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('Authentication required');
  }

  const { error } = await supabase
    .from('saved_replies')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting reply:', error);
    if (error.code === '42501') {
      throw new Error('Permission denied: You can only delete your own replies');
    }
    throw new Error(error.message);
  }
};