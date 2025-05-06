export type CommentSortOrder = 'relevance' | 'time';
export type Tone = 'casual' | 'professional' | 'humorous' | 'engaging';
export type ReplyLength = 'short' | 'medium' | 'long';

export interface ReplySettings {
  tone: Tone;
  length: ReplyLength;
  useEmojis: boolean;
  customInstructions?: string;
}

export interface Comment {
  id: string;
  text: string;
  authorDisplayName: string;
  authorProfileImageUrl?: string;
  publishedAt: string;
  likeCount: number;
  suggestedReplies?: string[];
}

export interface SavedReply {
  id: string;
  reply_text: string;
  original_comment: string;
  platform: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  custom_instructions: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserUsage {
  id: string;
  user_id: string;
  total_replies_generated: number;
  created_at: string;
  updated_at: string;
}