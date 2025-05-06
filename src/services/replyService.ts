import { ReplySettings } from '../types';
import toast from 'react-hot-toast';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const generateReplies = async (
  commentText: string, 
  settings: ReplySettings,
  videoContext: { title: string; description: string } | null
): Promise<string[]> => {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] 🚀 Starting request to generate replies`);
  
  try {
    const functionUrl = `${SUPABASE_URL}/functions/v1/smart-replies-ai`;
    console.log(`[${requestId}] 📍 Function URL:`, functionUrl);
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY
    };
    
    console.log(`[${requestId}] 📋 Request headers:`, {
      ...headers,
      'Authorization': '[REDACTED]',
      'apikey': '[REDACTED]'
    });

    const sanitizedContext = videoContext ? {
      title: videoContext.title
        .replace(/[\x00-\x1F\x7F]/g, '')
        .replace(/"/g, '\\"')
        .replace(/\s+/g, ' ')
        .trim(),
      description: videoContext.description
        .slice(0, 1000)
        .replace(/[\x00-\x1F\x7F]/g, '')
        .replace(/"/g, '\\"')
        .replace(/\s+/g, ' ')
        .trim()
    } : null;

    console.log(`[${requestId}] 📦 Request payload:`, { 
      comment: commentText, 
      settings,
      videoContext: sanitizedContext
    });

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers,
      mode: 'cors',
      body: JSON.stringify({
        comment: commentText,
        settings,
        videoContext: sanitizedContext
      })
    });
    
    console.log(`[${requestId}] ✅ Response received:`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${requestId}] ❌ Error response:`, errorText);
      
      let errorMessage = 'Failed to generate replies';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(`[${requestId}] 📦 Response data:`, data);
    
    if (!data.replies || !Array.isArray(data.replies) || data.replies.length === 0) {
      const error = 'No replies received from the server';
      console.error(`[${requestId}] ❌ ${error}`);
      toast.error(error);
      throw new Error(error);
    }

    return data.replies;
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to generate replies');
    console.error(`[${requestId}] 💥 Error:`, error);
    throw error;
  }
};