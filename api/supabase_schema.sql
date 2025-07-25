-- Recipe Generator Database Schema for Supabase
-- Run these commands in your Supabase SQL Editor to set up the database

-- Enable Row Level Security for all tables
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only see their own data
CREATE POLICY "Users can only see their own data" ON users
  FOR ALL USING (auth.uid() = id);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT[],
  instructions TEXT[],
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  cuisine TEXT,
  image TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for recipes table
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create policy for recipes - users can only see their own recipes
CREATE POLICY "Users can only access their own recipes" ON recipes
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_search ON recipes USING gin(to_tsvector('english', title || ' ' || description || ' ' || cuisine));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function for full-text search on recipes
CREATE OR REPLACE FUNCTION search_recipes(user_email TEXT, search_query TEXT)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  title TEXT,
  description TEXT,
  ingredients TEXT[],
  instructions TEXT[],
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  difficulty TEXT,
  cuisine TEXT,
  image TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.*
  FROM recipes r
  JOIN users u ON r.user_id = u.id
  WHERE u.email = user_email
    AND (
      r.title ILIKE '%' || search_query || '%' OR
      r.description ILIKE '%' || search_query || '%' OR
      r.cuisine ILIKE '%' || search_query || '%' OR
      search_query = ANY(r.tags)
    )
  ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Note: You may need to adjust the RLS policies based on your authentication method
-- The current policies assume you're using email-based identification
-- If you're using Supabase Auth, you might want to use auth.uid() instead