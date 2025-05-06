import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    const { videoId } = await req.json();

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
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch video details');
    }

    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found');
    }

const videoDetails = {
  title: data.items[0].snippet.title,
  thumbnailUrl: data.items[0].snippet.thumbnails.medium.url,
  description: data.items[0].snippet.description?.slice(0, 1000) || ''
};

    return new Response(
      JSON.stringify(videoDetails),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch video details' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});