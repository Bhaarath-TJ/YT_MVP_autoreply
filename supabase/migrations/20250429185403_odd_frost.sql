/*
  # Create user tokens table

  1. New Tables
    - `user_tokens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `access_token` (text)
      - `refresh_token` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `user_tokens` table
    - Add policies for authenticated users to read/write their own tokens
*/

CREATE TABLE IF NOT EXISTS user_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own tokens"
  ON user_tokens
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens"
  ON user_tokens
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tokens"
  ON user_tokens
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);