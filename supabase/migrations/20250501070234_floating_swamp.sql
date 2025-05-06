/*
  # Add saved replies table

  1. New Tables
    - `saved_replies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `reply_text` (text, not null)
      - `original_comment` (text, not null)
      - `platform` (text, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `saved_replies` table
    - Add policy for authenticated users to insert their own replies
    - Add policy for authenticated users to read their own replies
    - Add policy for authenticated users to delete their own replies
*/

CREATE TABLE IF NOT EXISTS saved_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  reply_text text NOT NULL,
  original_comment text NOT NULL,
  platform text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own saved replies"
  ON saved_replies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own saved replies"
  ON saved_replies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved replies"
  ON saved_replies
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);