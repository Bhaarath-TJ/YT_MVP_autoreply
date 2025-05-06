/*
  # Create waitlist table

  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key)
      - `email` (text, not null)
      - `platforms` (text[], not null)
      - `submitted_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `waitlist` table
    - Add policy for authenticated and anonymous users to insert data
*/

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  platforms text[] NOT NULL,
  submitted_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert into waitlist"
  ON waitlist
  FOR INSERT
  TO public
  WITH CHECK (true);