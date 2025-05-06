/*
  # Create reddit_tokens table

  1. New Tables
    - `reddit_tokens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `access_token` (text)
      - `refresh_token` (text)
      - `expires_in` (integer)
      - `scope` (text)
      - `token_type` (text)
      - `fetched_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `reddit_tokens` table
    - Add policy for authenticated users to read their own tokens
    - Add policy for authenticated users to update their own tokens
    - Add policy for authenticated users to insert their own tokens
*/

CREATE TABLE IF NOT EXISTS reddit_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  expires_in integer NOT NULL,
  scope text NOT NULL,
  token_type text NOT NULL,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE reddit_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own tokens"
  ON reddit_tokens
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens"
  ON reddit_tokens
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tokens"
  ON reddit_tokens
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);