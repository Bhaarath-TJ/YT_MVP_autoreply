import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "npm:openai@^4.28.0";
import { buildReplyPrompt } from "../_shared/buildReplyPrompt.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
};

interface RequestPayload {
  videoTitle: string;
  videoDescription: string;
  comments: { id: string; text: string }[];
}

serve(async (req) => {
  const requestId = crypto.randomUUID().slice(0, 8);
  console.log(`[${requestId}] 📥 Received ${req.method} request`);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const payload: RequestPayload = await req.json();
    console.log(`[${requestId}] 📦 Request payload:`, payload);

    // Validate payload
    if (!payload.videoTitle || !payload.videoDescription || !Array.isArray(payload.comments)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (payload.comments.length > 5) {
      return new Response(
        JSON.stringify({ error: 'Maximum 5 comments allowed per request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

    if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response(
        JSON.stringify({ error: 'Missing environment variables' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Could not identify user' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check user's current reply count
    const { data: usage } = await supabase
      .from("user_usage")
      .select("total_replies_generated")
      .eq("user_id", user.id)
      .single();

    const replyCount = usage?.total_replies_generated || 0;
    const newReplies = payload.comments.length;

    if (replyCount + newReplies > 100) {
      return new Response(
        JSON.stringify({
          error: "You’ve reached your 100 free replies. Upgrade to continue using CommentQuick.",
          code: "LIMIT_EXCEEDED"
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const messages = buildReplyPrompt(payload);

    console.log(`[${requestId}] 🤖 Sending request to OpenAI with messages:`, messages);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages,
      temperature: 0.7,
      max_tokens: 500,
      n: 1,
    });

    const responseContent = completion.choices[0].message?.content;
    console.log(`[${requestId}] ✅ OpenAI response:`, responseContent);

    if (!responseContent) throw new Error('No response from OpenAI');

    const replyRegex = /Reply ([a-zA-Z0-9]+):\s*(.+?)(?=Reply|$)/g;
    const replies = [];
    let match;

    while ((match = replyRegex.exec(responseContent))) {
      const [, commentId, replyText] = match;
      replies.push({ commentId, reply: replyText.trim() });
    }

    if (
      replies.length !== payload.comments.length ||
      !payload.comments.every(c => replies.some(r => r.commentId === c.id))
    ) {
      throw new Error('Failed to generate replies for all comments');
    }

    // Update usage
    await supabase.from("user_usage").upsert({
      user_id: user.id,
      total_replies_generated: replyCount + newReplies
    });

    return new Response(
      JSON.stringify({ replies }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[${requestId}] 💥 Error:`, error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate replies', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
