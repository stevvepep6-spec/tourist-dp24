/*
  # User Profile, Favorites, and History Features

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `avatar_url` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `item_id` (uuid, references places or foods)
      - `item_type` (text, either 'place' or 'food')
      - `created_at` (timestamptz)
    
    - `history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `item_id` (uuid, references places or foods)
      - `item_type` (text, either 'place' or 'food')
      - `visited_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own profile
      - Update their own profile
      - Manage their own favorites
      - Manage their own history
    - Add trigger to auto-create profile on user signup
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  item_id uuid NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('place', 'food')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_id, item_type)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  item_id uuid NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('place', 'food')),
  visited_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_id, item_type)
);

ALTER TABLE history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own history"
  ON history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history"
  ON history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own history"
  ON history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', ''));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;