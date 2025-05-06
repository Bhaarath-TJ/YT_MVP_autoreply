import { ChatCompletionMessageParam } from 'openai/resources';
import { ReplySettings } from '../types';

interface BuildMessagesParams {
  comments: { id: string; text: string }[];
  settings: ReplySettings;
  videoContext: {
    title: string;
    description: string;
  } | null;
}

export function buildMessagesForComments(params: BuildMessagesParams): ChatCompletionMessageParam[] {
  const { comments, settings, videoContext } = params;

  // Ensure description is capped at 1000 characters
  const description = videoContext?.description?.slice(0, 1000) || '';

  const getLengthDescription = (length: string) => {
    switch (length) {
      case 'short': return 'One-line replies, quick and snappy';
      case 'medium': return 'Two sentences, thoughtful and easy to read';
      case 'long': return 'Three to five sentences, detailed and engaging';
      default: return 'Two sentences, thoughtful and easy to read';
    }
  };

  const getToneDescription = (tone: string) => {
    switch (tone) {
      case 'casual': return 'Friendly and laid-back like chatting with a friend';
      case 'professional': return 'Polished and respectful, suited for serious topics';
      case 'humorous': return 'Playful and witty, adding light fun to replies';
      case 'engaging': return 'Encourages conversation and thoughtful responses';
      default: return 'Polished and respectful, suited for serious topics';
    }
  };

  // Build system message with video context and reply settings
  const systemContent = [
    'You are helping a YouTube creator craft smart, relevant replies to comments.',
    videoContext ? `The video title is: "${videoContext.title}"` : '',
    videoContext && description ? `The description is: "${description}"` : '',
    '',
    'Reply settings:',
    `- Tone: ${settings.tone} — ${getToneDescription(settings.tone)}`,
    `- Length: ${settings.length} — ${getLengthDescription(settings.length)}`,
    `- Emojis: ${settings.useEmojis ? 'ON — Add 1-2 fitting emojis naturally' : 'OFF — Keep replies text-only'}`,
    settings.customInstructions ? `\nCustom Instructions:\n${settings.customInstructions}` : '',
  ].filter(Boolean).join('\n');

  // Format comments list
  const formattedComments = comments
    .map(comment => `Comment ${comment.id}: ${comment.text}`)
    .join('\n');

  // Build the user message with comments and instructions
  const userContent = [
    formattedComments,
    '',
    'Reply to each comment using this format:',
    'Reply <id>: <reply text>',
    '',
    'Only include the reply text. Do not repeat the comment or explain it.',
  ].join('\n');

  return [
    { role: 'system', content: systemContent },
    { role: 'user', content: userContent }
  ];
}