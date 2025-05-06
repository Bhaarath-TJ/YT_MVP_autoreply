import { Comment, CommentSortOrder } from '../types';
import { extractVideoId } from '../utils/extractVideoId';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface VideoDetails {
  title: string;
  thumbnailUrl: string;
  description?: string;
}

const fetchVideoDetails = async (videoId: string): Promise<VideoDetails> => {
  try {
    const functionUrl = `${SUPABASE_URL}/functions/v1/fetch-youtube-details`;

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ videoId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge Function Error Response:', errorText);
      throw new Error('Failed to fetch video details');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch video details:', err);
    throw new Error('Failed to fetch video details');
  }
};

const fetchComments = async (
  videoUrl: string, 
  maxComments: number = 100,
  sortOrder: CommentSortOrder = 'relevance'
): Promise<Comment[]> => {
  const videoId = extractVideoId(videoUrl);
  
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  try {
    let allComments: Comment[] = [];
    let nextPageToken: string | null = null;
    const pageSize = Math.min(maxComments, 50); // YouTube API max per page is 50

    do {
      const functionUrl = `${SUPABASE_URL}/functions/v1/fetch-youtube-comments`;
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({ 
          videoId, 
          pageToken: nextPageToken,
          sortOrder,
          maxResults: pageSize
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Edge Function Error Response:', errorText);
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      console.log("📦 Full response from fetch-youtube-comments:", data);
console.log("🧪 typeof data.comments:", typeof data.comments);
console.log("🧪 Is data.comments an array?:", Array.isArray(data.comments));

// ✅ Defensive check (add this)
if (!Array.isArray(data.comments)) {
  console.error('Invalid response format from fetch-youtube-comments:', data);
  throw new Error('Invalid response format from comments API');
}

allComments = [...allComments, ...data.comments];
nextPageToken = data.nextPageToken;
      // Break if we have enough comments or there are no more pages
      if (allComments.length >= maxComments || !nextPageToken) {
        break;
      }
    } while (nextPageToken);

    // Ensure we don't return more comments than requested
    return {
  comments: allComments.slice(0, maxComments),
  nextPageToken,
  totalResults: allComments.length
};

  } catch (err) {
    console.error('Failed to fetch comments:', err);
    throw new Error('Failed to fetch YouTube comments. Please try again later.');
  }
};

export { fetchComments, fetchVideoDetails, extractVideoId };