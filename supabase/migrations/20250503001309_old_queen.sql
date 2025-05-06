/*
  # Create user_usage table for tracking reply limits

  1. New Tables
    - `user_usage`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `total_replies_generated` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_usage` table
    - Add policies for authenticated users to read/update their own usage
*/

CREATE TABLE IF NOT EXISTS user_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  total_replies_generated integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own usage"
  ON user_usage
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
  ON user_usage
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
  ON user_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);