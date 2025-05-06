/*
  # Create selected replies table

  1. New Tables
    - `selected_replies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `video_id` (text, not null)
      - `comment_id` (text, not null)
      - `reply_text` (text, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `selected_replies` table
    - Add policy for authenticated users to insert their own replies
    - Add policy for authenticated users to read their own replies
*/

CREATE TABLE IF NOT EXISTS selected_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  video_id text NOT NULL,
  comment_id text NOT NULL,
  reply_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE selected_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own replies"
  ON selected_replies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own replies"
  ON selected_replies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);