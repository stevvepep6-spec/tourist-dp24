/*
  # Create Tourist Guide Tables

  1. New Tables
    - `places`
      - `id` (uuid, primary key) - Unique identifier for each place
      - `name` (text) - Name of the tourist place
      - `description` (text) - Detailed description of the place
      - `category` (text) - Category (e.g., mountain, beach, temple, cultural)
      - `location` (text) - Location address or area
      - `city` (text) - City name
      - `province` (text) - Province name
      - `latitude` (decimal) - Latitude coordinate
      - `longitude` (decimal) - Longitude coordinate
      - `operational_hours` (text) - Operating hours information
      - `price_range` (text) - Price range (e.g., "IDR 50,000 - IDR 100,000")
      - `rating` (decimal) - Rating out of 5
      - `image_url` (text) - Main image URL
      - `images` (jsonb) - Additional images array
      - `created_at` (timestamptz) - Record creation timestamp

    - `foods`
      - `id` (uuid, primary key) - Unique identifier for each food
      - `name` (text) - Name of the food
      - `description` (text) - Detailed description of the food
      - `category` (text) - Category (e.g., main dish, dessert, snack, beverage)
      - `location` (text) - Where to find it (restaurant/area name)
      - `city` (text) - City name
      - `province` (text) - Province name
      - `latitude` (decimal) - Latitude coordinate (optional)
      - `longitude` (decimal) - Longitude coordinate (optional)
      - `operational_hours` (text) - Operating hours
      - `price_range` (text) - Price range
      - `rating` (decimal) - Rating out of 5
      - `image_url` (text) - Main image URL
      - `images` (jsonb) - Additional images array
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (since this is a public tourist guide)
*/

CREATE TABLE IF NOT EXISTS places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  city text NOT NULL,
  province text NOT NULL,
  latitude decimal,
  longitude decimal,
  operational_hours text NOT NULL,
  price_range text NOT NULL,
  rating decimal CHECK (rating >= 0 AND rating <= 5) DEFAULT 0,
  image_url text NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  city text NOT NULL,
  province text NOT NULL,
  latitude decimal,
  longitude decimal,
  operational_hours text NOT NULL,
  price_range text NOT NULL,
  rating decimal CHECK (rating >= 0 AND rating <= 5) DEFAULT 0,
  image_url text NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to places"
  ON places FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to foods"
  ON foods FOR SELECT
  TO anon
  USING (true);
