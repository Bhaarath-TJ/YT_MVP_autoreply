import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "npm:openai@^4.28.0";

serve(async (req) => {
  const requestId = crypto.randomUUID().slice(0, 8);
  const origin = req.headers.get('origin') || '*';
  console.log(`[${requestId}] 📅 Received ${req.method} request from ${origin}`);

  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };

  const baseHeaders = {
    ...corsHeaders,
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    console.log(`[${requestId}] ✈️ Handling OPTIONS preflight`);
    return new Response(null, { status: 204, headers: baseHeaders });
  }

  if (req.method !== 'POST') {
    console.log(`[${requestId}] ❌ Method not allowed: ${req.method}`);
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: baseHeaders
    });
  }

  try {
    console.log(`[${requestId}] 📦 Parsing request body...`);
    const { comment, settings, videoContext } = await req.json(); // ✅ CHANGED: renamed from videoTitle
    console.log(`[${requestId}] 🖍️ Request payload:`, { comment, settings, videoContext }); // ✅ UPDATED log

    if (!comment || !settings) {
      console.log(`[${requestId}] ❌ Missing comment or settings`);
      return new Response(JSON.stringify({ error: 'Comment and settings are required' }), {
        status: 400,
        headers: baseHeaders
      });
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.log(`[${requestId}] ❌ OpenAI API key missing`);
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: baseHeaders
      });
    }

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const getLengthDescription = (length: string) => {
      switch (length.toLowerCase()) {
        case 'short': return 'One-line replies, quick and snappy';
        case 'medium': return 'Two sentences, thoughtful and easy to read';
        case 'long': return 'Three to five sentences, detailed and engaging';
        default: return 'Two sentences, thoughtful and easy to read';
      }
    };

    const getToneDescription = (tone: string) => {
      switch (tone.toLowerCase()) {
        case 'casual': return 'Friendly and laid-back like chatting with a friend';
        case 'professional': return 'Polished and respectful, suited for serious topics';
        case 'humorous': return 'Playful and witty, adding light fun to replies';
        case 'engaging': return 'Encourages conversation and thoughtful responses';
        default: return 'Polished and respectful, suited for serious topics';
      }
    };

    const buildSystemPrompt = (settings: any, videoTitle?: string) => {
      let prompt = `
You are an expert AI assistant helping a YouTube creator reply to comments naturally and thoughtfully.

Instructions:
Please follow all the preset reply settings first.

Preset Settings:
- Reply Length: ${settings.length} — ${getLengthDescription(settings.length)}
- Reply Tone: ${settings.tone} — ${getToneDescription(settings.tone)}
- Include Emojis: ${settings.useEmojis ? 'Yes — Add fitting emojis naturally.' : 'No — Keep replies text-only.'}

${settings.customInstructions ? `\nUser-defined instruction to apply **after** the above settings:\n${settings.customInstructions.trim()}` : ''}

Style Guidelines:
- Keep replies human, relatable, and in natural language.
- Respect the sentiment of the original comment (positive/negative/neutral).
- Encourage conversation if tone is set to "Engaging".
- If emojis are ON, use 1–2 relevant emojis naturally, not forced.
- Do not include numbers or bullet points in your replies.`;

      if (videoTitle) {
        prompt += `\n\nContext:
- This comment is on a video titled: "${videoTitle}"
- Consider the video's topic when crafting replies to make them more relevant and contextual.`;
      }

      prompt += `\n\nOutput Format:
Generate three replies separated by newlines, without any numbering or bullet points.

Example:
For comment "This was amazing!", settings casual/short/emojis ON:
So happy you liked it! 😄
Thanks a bunch! Means a lot! 👌
Appreciate it! More great stuff coming soon! 🚀

Now generate 3 replies accordingly.`;

      return prompt;
    };

    const systemPrompt = buildSystemPrompt(settings, videoContext?.title); // ✅ FIXED: use videoContext

    console.log(`[${requestId}] 🤖 Full GPT messages:`, [
      { role: "system", content: systemPrompt },
      { role: "user", content: comment }
    ]);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: comment }
      ],
      temperature: 0.7,
      max_tokens: 400,
      n: 1,
    });

    console.log(`[${requestId}] ✅ OpenAI API call successful`);
    console.log(`[${requestId}] 🧹 Full OpenAI response:`, JSON.stringify(completion, null, 2));

    const repliesRaw = completion.choices[0].message?.content || "";
    console.log(`[${requestId}] 📜 Raw replies text:`, repliesRaw);

    const replies = repliesRaw
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0)
      .filter(r => !r.match(/^(\d+\.|\-|\•)/))
      .slice(0, 3);

    console.log(`[${requestId}] 🎯 Final cleaned replies array:`, replies);

    return new Response(JSON.stringify({ replies }), {
      headers: baseHeaders
    });
  } catch (error) {
    console.error(`[${requestId}] 💥 Internal server error:`, error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: baseHeaders
    });
  }
});
