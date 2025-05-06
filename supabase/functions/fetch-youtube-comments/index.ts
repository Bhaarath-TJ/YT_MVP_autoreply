import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
};

interface YouTubeComment {
  id: string;
  snippet: {
    topLevelComment: {
      snippet: {
        textDisplay: string;
        authorDisplayName: string;
        authorProfileImageUrl: string;
        publishedAt: string;
        likeCount: number;
        updatedAt: string;
      }
    },
    totalReplyCount: number
  }
}

function getRelativeTimeString(dateString: string): string {
  const publishedDate = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - publishedDate.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return years === 1 ? '1 year ago' : `${years} years ago`;
  } else if (months > 0) {
    return months === 1 ? '1 month ago' : `${months} months ago`;
  } else if (days > 0) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  } else {
    return 'Just now';
  }
}

function decodeHtmlEntities(text: string): string {
  const specialEntities: { [key: string]: string } = {
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&#x2F;': '/',
    '&#x27;': "'",
    '&#x2d;': '-',
    '&#45;': '-',
    '&#8211;': '–',
    '&#8212;': '—',
    '&#8216;': "'",
    '&#8217;': "'",
    '&#8220;': '"',
    '&#8221;': '"',
    '&#8230;': '…',
    '&hellip;': '…',
    '&mdash;': '—',
    '&ndash;': '–',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
  };

  let decoded = text;

  Object.entries(specialEntities).forEach(([entity, char]) => {
    const regex = new RegExp(entity, 'g');
    decoded = decoded.replace(regex, char);
  });

  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(Number(dec));
  });

  decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  decoded = decoded.replace(/<br\s*\/?>/gi, '\n');
  decoded = decoded.replace(/<[^>]*>/g, '');

  return decoded;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    const { videoId, pageToken, sortOrder = 'relevance', maxResults = 50 } = await req.json();

    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Video ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const API_KEY = 'AIzaSyASOw-F413Laj6I6ni4ilYC7VNOLbES0bA';
    
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&order=${sortOrder}&textFormat=plainText&moderationStatus=published${pageToken ? `&pageToken=${pageToken}` : ''}&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch comments');
    }

    const comments = data.items.map((item: YouTubeComment) => ({
      id: item.id,
      text: decodeHtmlEntities(item.snippet.topLevelComment.snippet.textDisplay),
      authorDisplayName: item.snippet.topLevelComment.snippet.authorDisplayName,
      authorProfileImageUrl: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
      publishedAt: getRelativeTimeString(item.snippet.topLevelComment.snippet.publishedAt),
      likeCount: item.snippet.topLevelComment.snippet.likeCount || 0,
      replyCount: item.snippet.totalReplyCount || 0
    }));

    return new Response(
      JSON.stringify({
        comments,
        nextPageToken: data.nextPageToken || null,
        totalResults: data.pageInfo?.totalResults || comments.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch comments' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});