import { ChatCompletionMessageParam } from 'openai/resources';

interface BuildReplyPromptParams {
  videoTitle: string;
  videoDescription: string;
  comments: { id: string; text: string }[];
}

export function buildReplyPrompt(params: BuildReplyPromptParams): ChatCompletionMessageParam[] {
  const { videoTitle, videoDescription, comments } = params;

  // Build the system message with video context
  const systemMessage: ChatCompletionMessageParam = {
    role: 'system',
    content: `You are helping a YouTube creator craft smart, relevant replies to comments. The video title is: '${videoTitle}'. The description is: '${videoDescription}'. Use this context to reply appropriately.`
  };

  // Format comments list
  const formattedComments = comments
    .map(comment => `Comment ${comment.id}: ${comment.text}`)
    .join('\n');

  // Build the user message with comments and instructions
  const userMessage: ChatCompletionMessageParam = {
    role: 'user',
    content: `${formattedComments}\n\nReply to each comment using the comment ID like this:\nReply abcd1234: Thanks!\nReply xyz5678: I use the Blue Yeti mic.\n\nOnly include the reply text. Do not repeat the comment or explain it.`
  };

  return [systemMessage, userMessage];
}